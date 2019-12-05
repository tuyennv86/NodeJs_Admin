const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  categoryKey: {
    type: String,
    required: true
  },

  typeCategory: {
    type: Number,
    default:1,
    required: true
  },
  imageUrl: {
    type: String,
    default : ''
  },  
  active :{
    type: Boolean,
    default : true
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  editDate: {
    type: Date,
    default: Date.now
  },
  createBy: {
    type: String
  },
  editBy:{
    type: String
  }
});

module.exports = mongoose.model('Category', CategorySchema);