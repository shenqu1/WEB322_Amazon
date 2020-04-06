const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({

  userId:
  {
      type:String,
      required:true
  },
  productId:{
    type:String,
    required: true
  },
  productName:
  {
      type:String,
      required:true
  },
  price:
  {
      type: Number,
      required: true
  },
  quantity:
  {
    type: Number,
    required: true
  },
  description:
  {
    type: String,
    requires: true
  },
  productImg:
  {
    type: String
  },
  dataCreated:
  {
      type:Date,
      default:Date.now()
  }
});

const order = mongoose.model('Order', orderSchema);

module.exports=order;