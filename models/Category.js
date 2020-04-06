const mongoose = require('mongoose');
const moment = require('moment');
// const Populate = require("../utils/autopopulate");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  categoryName: { type: String, required: true },
  categoryKey: { type: String, required: true },
  parent: { type: Schema.ObjectId, ref :"Category", default: new mongoose.Types.ObjectId() },
  categoryType: { type: Schema.ObjectId, ref: 'CategoryType', required:true },
  typeCategory: { type: Number, required: true }, 
  order: { type: Number, required:true },
  imageUrl: { type: String, default : '' },  
  active: { type: Boolean, default : true },
  home : { type: Boolean, default : true },
  createDate: { type: Date },
  editDate: { type: Date },
  createBy: { type: String},
  editBy:{ type: String }  
});

CategorySchema.virtual('createDateIso').get(function () {
  return moment(this.createDate).format('MM/DD/YYYY, h:mm:ss a');
});

CategorySchema.virtual('editDateIso').get(function () {
  return moment(this.editDate).format('DD/MM/YYYY, h:mm:ss a');
});

CategorySchema.virtual('createDate_dd_mm_yyyy').get(function () {
  return moment(this.createDate).format('MM/DD/YYYY');
});

CategorySchema.virtual('editDate_dd_mm_yyyy').get(function () {
  return moment(this.editDate).format('DD/MM/YYYY');
});
// CategorySchema.pre('findOne', Populate('parent'))
//     .pre('find', Populate('parent'))

module.exports = mongoose.model('Category', CategorySchema);