const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
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