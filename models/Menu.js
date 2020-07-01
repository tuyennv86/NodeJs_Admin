const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
  Name: { type: String, required: true },
  categoryKey: { type: String, required: true },
  parent: { type: Schema.ObjectId, ref :"Menu", default: new mongoose.Types.ObjectId() },     
  category: { type: Schema.ObjectId, ref: 'Category', required:true },  
  order: { type: Number, required:true },  
  active: { type: Boolean, default : true },
  position : { type: Array , default : [] },
  createDate: { type: Date },
  editDate: { type: Date },
  createBy: { type: String},
  editBy:{ type: String }  
});

MenuSchema.virtual('createDateIso').get(function () {
  return moment(this.createDate).format('MM/DD/YYYY, h:mm:ss a');
});

MenuSchema.virtual('editDateIso').get(function () {
  return moment(this.editDate).format('DD/MM/YYYY, h:mm:ss a');
});

MenuSchema.virtual('createDate_dd_mm_yyyy').get(function () {
  return moment(this.createDate).format('MM/DD/YYYY');
});

MenuSchema.virtual('editDate_dd_mm_yyyy').get(function () {
  return moment(this.editDate).format('DD/MM/YYYY');
});

module.exports = mongoose.model('Menu', MenuSchema);