const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imgPath:
  {
    type: String,
    default: "/public/image/user.jpg"
  },
  dataCreated:
  {
      type:Date,
      default:Date.now()
  }
});



module.exports = mongoose.model('User', userSchema);