// backend/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/hr_app';

async function seed() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected for seeding');

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@local';
    const adminPass = process.env.SEED_ADMIN_PASS || 'adminpass';
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin already exists:', adminEmail);
      process.exit(0);
    }

    const hash = await bcrypt.hash(adminPass, 10);
    const admin = await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: hash,
      role: 'admin',
      baseSalary: 0,
      otRate: 0
    });

    console.log('Admin created:', adminEmail, 'with password:', adminPass);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
