const mongoose = require('mongoose');
const moment = require('moment');
const filePath = require('../configs/fileConstants');
const Schema = mongoose.Schema;

const AdvertisementSchema = new Schema({
    Name: { type: String, required: true },    
    category: [{ type: Schema.ObjectId, ref: 'Category'}],   
    order: { type: Number, required: true },
    imageUrl: { type: String, default: '' },    
    linkUrl: { type: String, default: '' },
    active: { type: Boolean, default: true },    
    viewType: { type: Boolean, default: true }, // Link qua mang true hay local flase
    position: { type: Array, default: [] },
    viewCounts: { type: Number, default: 0 },
    Destination: { type: String, default: '' },
    createDate: { type: Date },
    editDate: { type: Date },
    createBy: { type: String },
    editBy: { type: String }
});
AdvertisementSchema.virtual('ImageUrlFull').get(function () {
    return filePath.imagePathView + this.imageUrl;
});

AdvertisementSchema.virtual('createDateIso').get(function () {
    return moment(this.createDate).format('MM/DD/YYYY, h:mm:ss a');
});

AdvertisementSchema.virtual('editDateIso').get(function () {
    return moment(this.editDate).format('DD/MM/YYYY, h:mm:ss a');
});

AdvertisementSchema.virtual('createDate_dd_mm_yyyy').get(function () {
    return moment(this.createDate).format('MM/DD/YYYY');
});

AdvertisementSchema.virtual('editDate_dd_mm_yyyy').get(function () {
    return moment(this.editDate).format('DD/MM/YYYY');
});

module.exports = mongoose.model('Advertisement', AdvertisementSchema);