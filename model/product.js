const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  inventory: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    requires: true
  },
  bestSeller: {
    type: Boolean,
    required: true
  },
  productImg: {
    type: String
  },
  dataCreated: {
    type: Date,
    default: Date.now()
  }
});

const products = mongoose.model('Product', productSchema);

module.exports = products;