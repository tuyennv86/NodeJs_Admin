const mongoose = require('mongoose');
const moment = require('moment');
const numeral = require('numeral');
const filePath = require('../configs/fileConstants');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productName: { type: String, required: true },
    productKey: { type: String, unique:true, required: true },   
    productCode:{type:String },
    category: { type: Schema.ObjectId, ref: 'Category', required:true },   
    metaTile: {type: String },
    metaKeyword: {type:String},
    metaDescription: {type: String},
    quantum: {type: Number, default: 0, require: true},
    viewCounts:{type: Number, default: 0},
    price: {type: Number, required: true, default: 0},
    priceOld: {type: Number, required: true, default: 0},
    order: { type: Number, required:true },
    imageUrl: { type: String, default : '' },  
    active: { type: Boolean, default : true },
    home : { type: Boolean, default : true },
    imageRelated: { type: Array, default:[] },
    preview: {type: String, default: ''},
    detail: {type:String, default:''},
    // tags:[{tagsName: String, tagsKey: String}],
    createDate: { type: Date },
    editDate: { type: Date },
    createBy: { type: String},
    editBy:{ type: String }  
  });
  ProductSchema.virtual('ImageUrlFull').get(function(){
    return filePath.imagePathView + this.imageUrl;
  });

  ProductSchema.virtual('priceFormat').get(function(){
    return numeral(this.price).format('0,0');
  });

  ProductSchema.virtual('priceOldFormat').get(function(){
    return numeral(this.priceOld).format('0,0');
  });

  ProductSchema.virtual('createDateIso').get(function () {
    return moment(this.createDate).format('MM/DD/YYYY, h:mm:ss a');
  });
  
  ProductSchema.virtual('editDateIso').get(function () {
    return moment(this.editDate).format('DD/MM/YYYY, h:mm:ss a');
  });
  
  ProductSchema.virtual('createDate_dd_mm_yyyy').get(function () {
    return moment(this.createDate).format('MM/DD/YYYY');
  });
  
  ProductSchema.virtual('editDate_dd_mm_yyyy').get(function () {
    return moment(this.editDate).format('DD/MM/YYYY');
  });
 
module.exports = mongoose.model('product', ProductSchema);