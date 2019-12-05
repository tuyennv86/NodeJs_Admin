const mongoose = require('mongoose');
const moment = require('moment');

const CategoryTypeSchema = new mongoose.Schema({
  typeName: {
    type: String,
    required: true
  },
  typeInt: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

CategoryTypeSchema
.virtual('date_mm_dd_yyyy')
.get(function () {
  return moment(this.date).format('MM/DD/YYYY, h:mm:ss a');
});


module.exports = mongoose.model('CategoryType', CategoryTypeSchema);
