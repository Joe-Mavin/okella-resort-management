import axios from 'axios';

class EmailService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@luxuryresort.com';
    this.senderName = process.env.BREVO_SENDER_NAME || 'Luxury Coastal Resort';
    this.baseURL = 'https://api.brevo.com/v3';
  }

  // Send email via Brevo API
  async sendEmail(to, subject, htmlContent, textContent = '') {
    try {
      const response = await axios.post(
        `${this.baseURL}/smtp/email`,
        {
          sender: {
            name: this.senderName,
            email: this.senderEmail
          },
          to: [
            {
              email: to.email || to,
              name: to.name || ''
            }
          ],
          subject: subject,
          htmlContent: htmlContent,
          textContent: textContent || this.stripHtml(htmlContent)
        },
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Email sent successfully to ${to.email || to}`);
      return { success: true, messageId: response.data.messageId };
    } catch (error) {
      console.error('❌ Email Send Error:', error.response?.data || error.message);
      throw new Error('Failed to send email');
    }
  }

  // Strip HTML tags for plain text
  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  // Booking confirmation email
  async sendBookingConfirmation(booking, user) {
    const subject = `Booking Confirmation - ${booking.bookingReference}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #2E2E2E; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00A8B5 0%, #0086A8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #FFFFFF; padding: 30px; border: 1px solid #F7E9D7; }
          .footer { background: #F7E9D7; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background: #00A8B5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .details { background: #F7E9D7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; }
          .highlight { color: #00A8B5; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏖️ Booking Confirmed!</h1>
            <p>Your luxury escape awaits</p>
          </div>
          <div class="content">
            <h2>Dear ${user.name},</h2>
            <p>Thank you for choosing Luxury Coastal Resort! We're thrilled to host you.</p>
            
            <div class="details">
              <h3>Booking Details</h3>
              <div class="details-row">
                <span>Booking Reference:</span>
                <span class="highlight">${booking.bookingReference}</span>
              </div>
              <div class="details-row">
                <span>Check-in:</span>
                <span>${new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="details-row">
                <span>Check-out:</span>
                <span>${new Date(booking.checkOutDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="details-row">
                <span>Nights:</span>
                <span>${booking.numberOfNights}</span>
              </div>
              <div class="details-row">
                <span>Guests:</span>
                <span>${booking.guests.adults} Adult(s)${booking.guests.children > 0 ? `, ${booking.guests.children} Child(ren)` : ''}</span>
              </div>
              <div class="details-row">
                <span>Total Amount:</span>
                <span class="highlight">KES ${booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            ${booking.specialRequests ? `
              <div style="background: #FFF9E6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>Your Special Requests:</strong>
                <p>${booking.specialRequests}</p>
              </div>
            ` : ''}

            <p>We'll send you a reminder a few days before your arrival with check-in instructions.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/bookings/${booking._id}" class="button">View Booking Details</a>
            </div>

            <p>If you have any questions, feel free to contact us at any time.</p>
            
            <p>Looking forward to welcoming you!<br>
            <strong>The Luxury Coastal Resort Team</strong></p>
          </div>
          <div class="footer">
            <p>🏖️ Luxury Coastal Resort | Paradise Beach, Mombasa, Kenya</p>
            <p>📞 +254 700 000 000 | ✉️ info@luxuryresort.com</p>
            <p>&copy; ${new Date().getFullYear()} Luxury Coastal Resort. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(
      { email: user.email, name: user.name },
      subject,
      htmlContent
    );
  }

  // Payment confirmation email
  async sendPaymentConfirmation(payment, booking, user) {
    const subject = `Payment Received - ${payment.transactionReference}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #2E2E2E; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00A8B5 0%, #0086A8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #FFFFFF; padding: 30px; border: 1px solid #F7E9D7; }
          .footer { background: #F7E9D7; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
          .success-icon { font-size: 60px; text-align: center; margin: 20px 0; }
          .details { background: #F7E9D7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; }
          .highlight { color: #00A8B5; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>Payment Successful!</h1>
          </div>
          <div class="content">
            <h2>Dear ${user.name},</h2>
            <p>We've received your payment. Thank you!</p>
            
            <div class="details">
              <h3>Payment Details</h3>
              <div class="details-row">
                <span>Transaction Reference:</span>
                <span class="highlight">${payment.transactionReference}</span>
              </div>
              ${payment.mpesa?.transactionID ? `
                <div class="details-row">
                  <span>M-PESA Receipt:</span>
                  <span>${payment.mpesa.transactionID}</span>
                </div>
              ` : ''}
              <div class="details-row">
                <span>Amount Paid:</span>
                <span class="highlight">KES ${payment.amount.toLocaleString()}</span>
              </div>
              <div class="details-row">
                <span>Payment Method:</span>
                <span>${payment.paymentMethod.toUpperCase()}</span>
              </div>
              <div class="details-row">
                <span>Booking Reference:</span>
                <span>${booking.bookingReference}</span>
              </div>
              <div class="details-row">
                <span>Date:</span>
                <span>${new Date(payment.paidAt || payment.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <p>Your booking is now confirmed. We look forward to welcoming you!</p>
            
            <p>Best regards,<br>
            <strong>The Luxury Coastal Resort Team</strong></p>
          </div>
          <div class="footer">
            <p>🏖️ Luxury Coastal Resort | Paradise Beach, Mombasa, Kenya</p>
            <p>📞 +254 700 000 000 | ✉️ info@luxuryresort.com</p>
            <p>&copy; ${new Date().getFullYear()} Luxury Coastal Resort. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(
      { email: user.email, name: user.name },
      subject,
      htmlContent
    );
  }

  // Password reset email
  async sendPasswordReset(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const subject = 'Password Reset Request';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #2E2E2E; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00A8B5 0%, #0086A8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #FFFFFF; padding: 30px; border: 1px solid #F7E9D7; }
          .footer { background: #F7E9D7; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background: #00A8B5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #FFF9E6; padding: 15px; border-left: 4px solid #FFA500; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>We received a request to reset your password for your Luxury Coastal Resort account.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>

            <p>Or copy and paste this link into your browser:</p>
            <p style="background: #F7E9D7; padding: 10px; word-break: break-all; font-size: 12px;">${resetUrl}</p>

            <div class="warning">
              <strong>⚠️ Important:</strong>
              <p>This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>
            </div>

            <p>Best regards,<br>
            <strong>The Luxury Coastal Resort Team</strong></p>
          </div>
          <div class="footer">
            <p>🏖️ Luxury Coastal Resort</p>
            <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(
      { email: user.email, name: user.name },
      subject,
      htmlContent
    );
  }

  // Welcome email
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Luxury Coastal Resort! 🏖️';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #2E2E2E; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00A8B5 0%, #0086A8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #FFFFFF; padding: 30px; border: 1px solid #F7E9D7; }
          .footer { background: #F7E9D7; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background: #00A8B5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .feature-box { background: #F7E9D7; padding: 15px; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏖️ Welcome to Paradise!</h1>
            <p>Your luxury escape begins here</p>
          </div>
          <div class="content">
            <h2>Hello ${user.name}! 👋</h2>
            <p>Welcome to Luxury Coastal Resort! We're thrilled to have you join our community of travelers seeking unforgettable experiences.</p>
            
            <h3>What you can do:</h3>
            <div class="feature-box">
              ✨ <strong>Browse Luxurious Rooms</strong> - Find your perfect coastal retreat
            </div>
            <div class="feature-box">
              📅 <strong>Easy Booking</strong> - Reserve your stay in minutes
            </div>
            <div class="feature-box">
              🏄 <strong>Activities & Tours</strong> - Explore local adventures
            </div>
            <div class="feature-box">
              💳 <strong>Secure M-PESA Payments</strong> - Fast and convenient
            </div>

            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/rooms" class="button">Explore Our Rooms</a>
            </div>

            <p>If you have any questions, our team is here to help!</p>
            
            <p>Warm regards,<br>
            <strong>The Luxury Coastal Resort Team</strong></p>
          </div>
          <div class="footer">
            <p>🏖️ Luxury Coastal Resort | Paradise Beach, Mombasa, Kenya</p>
            <p>📞 +254 700 000 000 | ✉️ info@luxuryresort.com</p>
            <p>&copy; ${new Date().getFullYear()} Luxury Coastal Resort. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(
      { email: user.email, name: user.name },
      subject,
      htmlContent
    );
  }
}

export default new EmailService();
