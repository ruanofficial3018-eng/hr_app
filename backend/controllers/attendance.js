const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { haversineDistance } = require('../utils/haversine');
require('dotenv').config();
const createCsvWriter = require('csv-writer').createObjectCsvStringifier;

exports.punch = async (req, res) => {
  try{
    const { type, lat, lon } = req.body;
    if(!type || (type!=='in' && type!=='out')) return res.status(400).json({message:'Invalid type'});
    if(typeof lat !== 'number' || typeof lon !== 'number') return res.status(400).json({message:'Coordinates required'});
    const officeLat = parseFloat(process.env.OFFICE_LAT);
    const officeLon = parseFloat(process.env.OFFICE_LON);
    const dist = haversineDistance(lat, lon, officeLat, officeLon);
    const allowed = dist <= (parseFloat(process.env.OFFICE_RADIUS_METERS||100));
    if(!allowed) return res.status(403).json({message:'Outside allowed radius', distance: dist});
    const att = await Attendance.create({user:req.user.id, type, lat, lon});
    res.json({message:'Punched', att});
  } catch(err){
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
};

exports.myToday = async (req, res) => {
  const start = new Date();
  start.setHours(0,0,0,0);
  const end = new Date();
  end.setHours(23,59,59,999);
  const items = await Attendance.find({user:req.user.id, timestamp: {$gte:start, $lte:end}}).sort('timestamp');
  res.json(items);
};

exports.forUser = async (req, res) => {
  const items = await Attendance.find({user:req.params.id}).sort('-timestamp').limit(500);
  res.json(items);
};

exports.exportCsv = async (req, res) => {
  const items = await Attendance.find().populate('user','name email').sort('-timestamp').limit(10000);
  const csvWriter = createCsvWriter({
    header: [
      {id:'name', title:'Name'},
      {id:'email', title:'Email'},
      {id:'type', title:'Type'},
      {id:'timestamp', title:'Timestamp'},
      {id:'lat', title:'Lat'},
      {id:'lon', title:'Lon'}
    ]
  });
  const records = items.map(i => ({
    name: i.user?.name || '',
    email: i.user?.email || '',
    type: i.type,
    timestamp: i.timestamp.toISOString(),
    lat: i.lat,
    lon: i.lon
  }));
  const csv = csvWriter.getHeaderString() + csvWriter.stringifyRecords(records);
  res.setHeader('Content-disposition','attachment; filename=attendance.csv');
  res.set('Content-Type','text/csv');
  res.send(csv);
};
