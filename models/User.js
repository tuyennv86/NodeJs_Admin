const mongoose = require('mongoose');
const moment = require('moment');
const filePath = require('../configs/fileConstants');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  ImageUrl: {
    type: String,
    default : ''
  },
  active :{
    type: Boolean,
    default : true
  },
  admin :{
    type: Boolean,
    default : true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.virtual('date_dd_mm_yyyy').get(function () {
  return moment(this.date).format('DD/MM/YYYY, h:mm:ss a');
});
UserSchema.virtual('ImageUrlFull').get(function(){
  return filePath.avataPathView + this.ImageUrl;
});

module.exports = mongoose.model('User', UserSchema);
