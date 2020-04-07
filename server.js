const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session');


require('dotenv').config({path:"./config/keys.env"});

const productController = require("./controllers/products");
const categoryController = require("./controllers/category");
const userController = require("./controllers/user");
const orderController = require("./controllers/order");

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
app.use((req,res,next)=>{
    if(req.query.method=="PUT") {
        req.method = "PUT";
    } else if(req.query.method=="DELETE") {
        req.method = "DELETE";
    }
    next();
});

app.use(fileUpload());

app.use(session({secret: `${process.env.SECRET}`, resave: false, saveUninitialized: true}));

app.use((req,res,next)=>{
    res.locals.user = req.session.userInfo;

    next();
});

app.use("/", productController);
app.use("/category", categoryController);
app.use("/user", userController);
app.use("/order", orderController);
app.use("/", (req,res)=>{
    res.render("general/404");
});

mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`MongoDB connected`);
})
.catch(err=>console.log(`Error while connecting to mongoDB ${err}`));



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Web Connected!`);
});