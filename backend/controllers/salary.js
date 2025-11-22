const User = require('../models/User');
const Attendance = require('../models/Attendance');
const SalaryRecord = require('../models/SalaryRecord');

// calculate monthly salary for a user by month (YYYY-MM)
function monthRange(yearMonth){
  const [y, m] = yearMonth.split('-').map(Number);
  const start = new Date(y, m-1, 1);
  const end = new Date(y, m-1+1, 0, 23,59,59,999);
  return {start,end};
}

exports.calculateForUser = async (req, res) => {
  const { userId } = req.params;
  const { month } = req.body; // e.g. 2025-11
  if(!month) return res.status(400).json({message:'month required'});
  const user = await User.findById(userId);
  if(!user) return res.status(404).json({message:'User not found'});
  const {start, end} = monthRange(month);
  const records = await Attendance.find({user:userId, timestamp: {$gte:start, $lte:end}}).sort('timestamp');
  // simple approach: count pairs (in->out) to compute hours
  let totalWorkMs = 0;
  for(let i=0;i<records.length;i++){
    if(records[i].type==='in'){
      // find next out
      for(let j=i+1;j<records.length;j++){
        if(records[j].type==='out'){
          totalWorkMs += (records[j].timestamp - records[i].timestamp);
          i = j;
          break;
        }
      }
    }
  }
  const workHours = totalWorkMs/1000/3600;
  // Let's assume baseSalary is monthly baseSalary on user.baseSalary
  const baseSalary = user.baseSalary || 0;
  const otRate = user.otRate || 0;
  const normalHours = 160; // typical working hours in month
  const overtimeHours = Math.max(0, workHours - normalHours);
  const otPay = overtimeHours * otRate;
  const total = baseSalary + otPay;
  const rec = await SalaryRecord.create({
    user: user._id, month, baseSalary, overtimeHours, otRate, total
  });
  res.json({month, workHours, overtimeHours, total, record: rec});
};

exports.myHistory = async (req, res) => {
  const recs = await SalaryRecord.find({user:req.user.id}).sort('-createdAt');
  res.json(recs);
};

exports.forUser = async (req, res) => {
  const recs = await SalaryRecord.find({user:req.params.id}).sort('-createdAt');
  res.json(recs);
};
