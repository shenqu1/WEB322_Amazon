const express = require("express");

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: false
}));

const productController = require("./controllers/products");
const formController = require("./controllers/form");

app.use("/", productController);
app.use("/form", formController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Web Connected!`);
});