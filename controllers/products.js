const express = require('express');
const router = express.Router();
const productModel = require("../model/product");
const productsModel = require("../model/products");

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

router.post("/product/add", (req,res)=>{
    const newProduct = {
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        inventory: req.body.inventory,
        bestSeller: (req.body.bestSeller ? true : false),
        imgPath: req.body.imgPath
    }
    const product = new productsModel(newProduct);
    product.save()
    .then(()=>{
        res.redirect("/productDashboard");
    })
    .catch(err=>console.log(`Erroe occured while entering into the database ${err}`));
});

router.get("/productDescription", (req, res) => {
    res.render("products/productDescription", {
        title: `Product Description`
    });
});

router.get("/shoppingCart", (req, res) => {
    res.render("products/shoppingCart", {
        title: `Shopping Cart`
    });
});



module.exports = router;