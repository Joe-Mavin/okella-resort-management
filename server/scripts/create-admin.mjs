import mongoose from 'mongoose';
import User from '../models/User.model.mjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Admin user data
    const adminData = {
      name: 'OKELLA Admin',
      email: 'admin@okellaresort.com',
      phone: '254700000000',
      password: 'Admin@123456',
      role: 'admin',
      isVerified: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists with email:', adminData.email);
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create(adminData);
    
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: Admin@123456');
    console.log('👤 Role:', admin.role);
    console.log('📱 Phone:', admin.phone);
    console.log('');
    console.log('🚀 You can now login at: http://localhost:5174/login');
    console.log('');
    console.log('⚠️ IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

createAdmin();
