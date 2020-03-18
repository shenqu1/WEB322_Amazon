const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title:
  {
      type:String,
      required:true
  },
  category:
  {
      type:String,
      required:true
  },
  price:
  {
      type: Number,
      required: true
  },
  bestSeler:
  {
      type: Boolean,
      required: true
  },
  imgPath:
  {
    type: String,
    required: true
  },
  dataCreated:
  {
      type:Date,
      default:Date.now()
  }
});

const products = mongoose.model('Products', productSchema);

model.export=products;