const express = require('express');
const router = express.Router();

const productModel = require("../model/product");

router.get("/", (req, res) => {
    res.render("products/home", {
        title: `Home`,
        categoryInfo: productModel.getType(),
        bestSellerInfo: productModel.getBestSeller()
    });
});

router.get("/products", (req, res) => {
    res.render("products/products", {
        title: `Product List`,
        productList: productModel.getProductList()
    });
});

module.exports = router;