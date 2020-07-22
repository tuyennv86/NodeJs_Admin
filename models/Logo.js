const mongoose = require('mongoose');
const moment = require('moment');
const filePath = require('../configs/fileConstants');
const Schema = mongoose.Schema;

const LogoSchema = new Schema({
    Name: { type: String, required: true },
    order: { type: Number, required: true },
    imageUrl: { type: String, default: '' },    
    linkUrl: { type: String, default: '' },
    active: { type: Boolean, default: true }, 
    Destination: { type: String, default: '' },
    type:{type: Number},// kieu logo hay banner
    createDate: { type: Date },
    editDate: { type: Date },
    createBy: { type: String },
    editBy: { type: String }
});
LogoSchema.virtual('ImageUrlFull').get(function () {
    return filePath.imagePathView + this.imageUrl;
});

LogoSchema.virtual('createDateIso').get(function () {
    return moment(this.createDate).format('MM/DD/YYYY, h:mm:ss a');
});

LogoSchema.virtual('editDateIso').get(function () {
    return moment(this.editDate).format('DD/MM/YYYY, h:mm:ss a');
});

LogoSchema.virtual('createDate_dd_mm_yyyy').get(function () {
    return moment(this.createDate).format('MM/DD/YYYY');
});

LogoSchema.virtual('editDate_dd_mm_yyyy').get(function () {
    return moment(this.editDate).format('DD/MM/YYYY');
});

module.exports = mongoose.model('Logo', LogoSchema);