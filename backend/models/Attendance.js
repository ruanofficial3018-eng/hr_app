const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref:'User', required:true},
  type: {type: String, enum:['in','out'], required:true},
  timestamp: {type: Date, default: Date.now},
  lat: Number,
  lon: Number,
  note: String
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
