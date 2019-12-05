const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  categoryKey: {
    type: String,
    required: true
  },
  parent: {
    type: Schema.Types.ObjectId, ref: "Category"
  },
  categoryType:{
    type:Schema.Types.ObjectId, ref: "CategoryType", 
    required:true
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

CategorySchema.virtual('createDate_dd_mm_yyyy')
.get(function () {
  return moment(this.createDate).format('MM/DD/YYYY, h:mm:ss a');
});

CategorySchema.virtual('editDate_dd_mm_yyyy')
.get(function () {
  return moment(this.editDate).format('DD/MM/YYYY, h:mm:ss a');
});

module.exports = mongoose.model('Category', CategorySchema);