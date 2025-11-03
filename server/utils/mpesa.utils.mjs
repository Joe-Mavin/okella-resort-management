import axios from 'axios';

class MPesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.passkey = process.env.MPESA_PASSKEY;
    this.shortcode = process.env.MPESA_SHORTCODE || '174379';
    this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    
    this.baseURL = this.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
    
    this.callbackURL = process.env.MPESA_CALLBACK_URL || 'http://localhost:5000/api/payments/mpesa/callback';
  }

  // Generate access token
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('❌ M-PESA Access Token Error:', error.response?.data || error.message);
      throw new Error('Failed to generate M-PESA access token');
    }
  }

  // Generate password for STK Push
  generatePassword() {
    const timestamp = this.getTimestamp();
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    return { password, timestamp };
  }

  // Get timestamp in required format
  getTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  // Format phone number to required format (254XXXXXXXXX)
  formatPhoneNumber(phone) {
    // Remove any spaces, dashes, or plus signs
    let formatted = phone.replace(/[\s\-\+]/g, '');
    
    // If starts with 0, replace with 254
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    }
    
    // If starts with 7 or 1, add 254
    if (formatted.match(/^[71]/)) {
      formatted = '254' + formatted;
    }
    
    // Ensure it's a valid Kenyan number
    if (!formatted.match(/^254[71][0-9]{8}$/)) {
      throw new Error('Invalid Kenyan phone number. Use format: 254XXXXXXXXX or 07XXXXXXXX');
    }
    
    return formatted;
  }

  // Initiate STK Push
  async initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount), // M-PESA requires integer
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.callbackURL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc || 'Luxury Resort Payment'
      };

      console.log('📱 Initiating M-PESA STK Push:', {
        phone: formattedPhone,
        amount: Math.ceil(amount),
        reference: accountReference
      });

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpush/v1/processrequest`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ M-PESA STK Push Response:', response.data);

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ M-PESA STK Push Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.errorMessage || 'Failed to initiate M-PESA payment');
    }
  }

  // Query STK Push status
  async queryStkPushStatus(checkoutRequestID) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      };

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpushquery/v1/query`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ M-PESA Query Error:', error.response?.data || error.message);
      throw new Error('Failed to query M-PESA transaction status');
    }
  }

  // Validate callback data
  validateCallback(callbackData) {
    try {
      const { Body } = callbackData;
      const resultCode = Body?.stkCallback?.ResultCode;
      const resultDesc = Body?.stkCallback?.ResultDesc;
      const merchantRequestID = Body?.stkCallback?.MerchantRequestID;
      const checkoutRequestID = Body?.stkCallback?.CheckoutRequestID;
      const callbackMetadata = Body?.stkCallback?.CallbackMetadata;

      // ResultCode 0 means success
      const isSuccess = resultCode === 0;

      let transactionData = {
        merchantRequestID,
        checkoutRequestID,
        resultCode,
        resultDesc,
        isSuccess
      };

      if (isSuccess && callbackMetadata) {
        const items = callbackMetadata.Item || [];
        
        items.forEach(item => {
          switch (item.Name) {
            case 'Amount':
              transactionData.amount = item.Value;
              break;
            case 'MpesaReceiptNumber':
              transactionData.transactionID = item.Value;
              break;
            case 'TransactionDate':
              transactionData.transactionDate = item.Value;
              break;
            case 'PhoneNumber':
              transactionData.phoneNumber = item.Value;
              break;
          }
        });
      }

      return transactionData;
    } catch (error) {
      console.error('❌ Callback Validation Error:', error);
      throw new Error('Invalid M-PESA callback data');
    }
  }
}

export default new MPesaService();
