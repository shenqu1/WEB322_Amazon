const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");


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
    userImg: {
        type: String,
        default: "user.jpg"
    },
    dataCreated: {
        type: Date,
        default: Date.now()
    },
    type: {
        type: String,
        default: "User"
    }
});

userSchema.pre("save", function (next) {

    bcrypt.genSalt(10)
        .then((salt) => {
            bcrypt.hash(this.password, salt)
                .then((encryptPassword) => {
                    this.password = encryptPassword;
                    next();
                })
                .catch(err => console.log(`Error occoured when hashing ${err}`));
        })
        .catch(err => console.log(`Error occoured when salting ${err}`));

});



module.exports = mongoose.model('User', userSchema);