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

router.get("/productDashboard", (req,res) => {
    res.render("products/productDashboard", {
        title: `Product Dashboard`,
        productList: productModel.getProductList()
    });
});

router.get("/product/add", (req,res) => {
    res.render("products/productAddForm", {
        title: `Add Products`
    });
});

router.post("/products/search", (req,res) => {
    const showList = {
        title: `Product Dashboard`
    };
    if(req.body["products-search"] == "all") {
        showList.productList = productModel.getProductList();
        showList.all = true;
    } else if(req.body["products-search"] == "valentine") {
        showList.productList = productModel.getValentine();
        showList.valen = true;
    }else if(req.body["products-search"] == "electronic") {
        showList.productList = productModel.getElectronic();
        showList.elec = true;
    }else if(req.body["products-search"] == "revhome") {
        showList.productList = productModel.getHome();
        showList.home = true;
    }else if(req.body["products-search"] == "fitness") {
        showList.productList = productModel.getFitness();
        showList.fit = true;
    }
    res.render("products/productDashboard", showList);
});

router.get("/productDescription", (req,res) => {
    res.render("products/productDescription", {
        title: `Product Description`
    });
});

module.exports = router;