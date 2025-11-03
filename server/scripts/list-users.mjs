import mongoose from 'mongoose';
import User from '../models/User.model.mjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const listUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('name email phone role isVerified createdAt');
    
    console.log(`\n📊 Total Users: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('No users found.');
      return;
    }

    // Group users by role
    const usersByRole = users.reduce((acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user);
      return acc;
    }, {});

    // Display users by role
    Object.keys(usersByRole).forEach(role => {
      console.log(`\n👥 ${role.toUpperCase()} USERS (${usersByRole[role].length}):`);
      console.log('─'.repeat(50));
      
      usersByRole[role].forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   📧 ${user.email}`);
        console.log(`   📱 ${user.phone}`);
        console.log(`   ✅ Verified: ${user.isVerified ? 'Yes' : 'No'}`);
        console.log(`   📅 Created: ${user.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    });

  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

listUsers();
