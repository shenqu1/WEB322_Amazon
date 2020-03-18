const express = require("express");

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const session = require('express-session');

require('dotenv').config({path:"./config/keys.env"});

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(session({secret: 'mysupersecret', resave: false, saveUninitialized: false}));

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: false
}));

const productController = require("./controllers/products");
const userController = require("./controllers/user");

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