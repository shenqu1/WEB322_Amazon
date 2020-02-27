const express = require("express");

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const productModel = require("./model/product");

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get("/", (req, res) => {
    res.render("home", {
        title: `Home`,
        categoryInfo: productModel.getType(),
        bestSellerInfo: productModel.getBestSeller()
    });
});

app.get("/products", (req, res) => {
    res.render("products", {
        title: `Product List`,
        productList: productModel.getProductList()
    });
});

app.get("/registration", (req, res) => {
    res.render("registration", {
        title: `Registration Page`
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        title: `Login Page`
    });
});

app.post("/registration", (req, res) => {
    const errors = [];
    if (req.body["reg-password"] != req.body["password-confirm"]) {
        errors.push(`*Password doesn't match!`)
    }
    if (errors.length > 0) {
        res.render("registration", {
            title: `Registration Page`,
            errorMessage: errors
        });
    } else {
        res.redirect("/");
    }
});

app.post("/login", (req, res) => {
    res.redirect("/");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Web Connected!`);
});