const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productName: { type: String, required: true },
    productKey: { type: String, required: true },   
    category: { type: Schema.ObjectId, ref: 'Category', required:true },   
    metaTile: {type: String },
    metaKeyword: {type:String},
    metaDescription: {type: String},
    viewCounts:{type: Number},
    price: {type: Number, required: true, default: 0},
    priceOld: {type: Number, required: true, default: 0},
    order: { type: Number, required:true },
    imageUrl: { type: String, default : '' },  
    active: { type: Boolean, default : true },
    home : { type: Boolean, default : true },
    imageRelated: { type: Array, default:[] },
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
 
  
  module.exports = mongoose.model('product', ProductSchema);