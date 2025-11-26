// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  department: { type: String, default: '' },
  designation: { type: String, default: '' },
  employeeId: { type: String, default: '' },
  role: { type: String, enum: ['admin','hr','manager','employee'], default: 'employee' },
  status: { type: String, enum: ['active','resigned','suspended'], default: 'active' },
  baseSalary: { type: Number, default: 0 },
  otRate: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  // additional profile sections
  personal: {
    dob: { type: Date },
    address: { type: String },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  documents: [{
    filename: String,
    url: String,
    uploadedAt: Date,
    docType: String
  }]
});

// Hide password and __v when converting to JSON
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
