const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');


require('dotenv').config({path:"./config/keys.env"});

const productController = require("./controllers/products");
const userController = require("./controllers/user");

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

app.engine('handlebars', exphbs({
    helpers:{
        matchSelect: function (a,b) {
            return a == b ? "selected" : "";
        }
    }
}));
app.set('view engine', 'handlebars');


app.use(fileUpload());

app.use("/", productController);
app.use("/user", userController);

mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`MongoDB connected`);
})
.catch(err=>console.log(`Error while connecting to mongoDB ${err}`));



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Web Connected!`);
});