const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {type:String, required:true},
  email: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  role: {type:String, enum:['admin','employee'], default:'employee'},
  baseSalary: {type:Number, default:0},
  otRate: {type:Number, default:0}
}, {timestamps:true});

module.exports = mongoose.model('User', UserSchema);
