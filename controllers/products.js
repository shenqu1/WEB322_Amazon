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
        productList: productModel.getProductList(),
    });
});

router.get("/valentine", (req, res) => {
    res.render("products/products", {
        title: `Product List/valentine`,
        productList: productModel.getValentine(),
        val: true
    });
});

router.get("/electronic", (req, res) => {
    res.render("products/products", {
        title: `Product List/electronic`,
        productList: productModel.getElectronic(),
        elec: true
    });
});

router.get("/revhome", (req, res) => {
    res.render("products/products", {
        title: `Product List/revhome`,
        productList: productModel.getHome(),
        home: true
    });
});

router.get("/fitness", (req, res) => {
    res.render("products/products", {
        title: `Product List/fitness`,
        productList: productModel.getFitness(),
        fitness: true
    });
});

router.get("/all", (req, res) => {
    res.render("products/products", {
        title: `Product List/all`,
        productList: productModel.getProductList(),
        all: true
    });
});

module.exports = router;