const mongoose = require('mongoose');
const moment = require('moment');
const filePath = require('../configs/fileConstants');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
    Name: { type: String, required: true },
    newsKey: { type: String, unique: true, required: true },
    category: { type: Schema.ObjectId, ref: 'Category', required: true },
    metaTile: { type: String },
    metaKeyword: { type: String },
    metaDescription: { type: String },
    viewCounts: { type: Number, default: 0 },
    order: { type: Number, required: true },
    imageUrl: { type: String, default: '' },
    active: { type: Boolean, default: true },
    type: { type: Array, default: [] },
    preview: { type: String, default: '' },
    detail: { type: String, default: '' },
    // tags:[{tagsName: String, tagsKey: String}],
    createDate: { type: Date },
    editDate: { type: Date },
    createBy: { type: String },
    editBy: { type: String }
});
NewsSchema.virtual('ImageUrlFull').get(function () {
    return filePath.imagePathView + this.imageUrl;
});

NewsSchema.virtual('createDateIso').get(function () {
    return moment(this.createDate).format('MM/DD/YYYY, h:mm:ss a');
});

NewsSchema.virtual('editDateIso').get(function () {
    return moment(this.editDate).format('DD/MM/YYYY, h:mm:ss a');
});

NewsSchema.virtual('createDate_dd_mm_yyyy').get(function () {
    return moment(this.createDate).format('MM/DD/YYYY');
});

NewsSchema.virtual('editDate_dd_mm_yyyy').get(function () {
    return moment(this.editDate).format('DD/MM/YYYY');
});

module.exports = mongoose.model('news', NewsSchema);