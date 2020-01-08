const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const CategoryTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true
  },
  typeInt: {
    type: Number,
    default: 1,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createBy: {
    type: String
  }
});

CategoryTypeSchema.virtual('dateIso').get(function () {
  return moment(this.date).format('MM/DD/YYYY, h:mm:ss a');
});

CategoryTypeSchema.virtual('date_mm_dd_yyyy').get(function () {
  return moment(this.date).format('MM/DD/YYYY');
});

module.exports = mongoose.model('CategoryType', CategoryTypeSchema);
