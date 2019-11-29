const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  categoryKey: {
    type: String,
    required: true
  },
  parent: [{
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }],
  typeCategory: {
    type: Number,
    default:1,
    required: true
  },
  imageUrl: {
    type: String,
    default : ''
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  active :{
    type: Boolean,
    default : true
  }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
