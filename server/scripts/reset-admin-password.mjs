import mongoose from 'mongoose';
import User from '../models/User.model.mjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@okellaresort.com';
    const newPassword = 'Admin@123456';

    // Find admin user
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      console.log('❌ Admin user not found with email:', adminEmail);
      process.exit(1);
    }

    // Update password
    admin.password = newPassword;
    await admin.save();
    
    console.log('🎉 Admin password reset successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 New Password:', newPassword);
    console.log('👤 Role:', admin.role);
    console.log('');
    console.log('🚀 You can now login at: http://localhost:5174/login');
    console.log('');
    console.log('⚠️ IMPORTANT: Change the password after login!');

  } catch (error) {
    console.error('❌ Error resetting admin password:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

resetAdminPassword();
