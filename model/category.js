const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category: {
    type: String,
    required: true
  },
  categoryImg: {
    type: String
  },
  dataCreated: {
    type: Date,
    default: Date.now()
  }
});

const category = mongoose.model('Category', categorySchema);

module.exports = category;