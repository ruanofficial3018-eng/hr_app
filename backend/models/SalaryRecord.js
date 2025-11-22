const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalaryRecordSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref:'User', required:true},
  month: String, // e.g. 2025-11
  baseSalary: Number,
  overtimeHours: Number,
  otRate: Number,
  total: Number,
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('SalaryRecord', SalaryRecordSchema);
