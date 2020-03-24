const express = require('express');
const router = express.Router();
const productModel = require("../model/product123");
const productsModel = require("../model/product");
const path = require("path");

router.get("/", (req, res) => {
    res.render("products/home", {
        title: `Home`,
        categoryInfo: productModel.getType(),
        bestSellerInfo: productModel.getBestSeller()
    });
});

router.get("/products", (req, res) => {
    productsModel.find()
    .then((products)=>{
        const filteredProducts = products.map(product=>{
            return {
                id: product._id,
                title: product.title,
                category: product.category,
                price: product.price,
                productImg: product.productImg,
                showBestSeller: (product.bestSeller ? "show-best-seller" : "hide-best-seller")
            }
        });
        res.render("products/products", {
            title: "Product List",
            productList: filteredProducts
        })
    })
    .catch(err=>console.log(`Error occoured when pulling from the database ${err}`));

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
    productsModel.find()
    .then((products)=>{
        const filteredProducts = products.map(product=>{
            return {
                id: product._id,
                title: product.title,
                category: product.category,
                price: product.price,
                productImg: product.productImg,
                inventory: product.inventory,
                bestSeller: product.bestSeller
            }
        });
        res.render("products/productDashboard", {
            title: "Product Dashboard",
            productList: filteredProducts
        })
    })
    .catch(err=>console.log(`Error occoured when pulling from the database ${err}`));
});

router.get("/product/add", (req,res) => {
    res.render("products/productAddForm", {
        title: `Add Products`
    });
});

router.post("/products/search", (req,res) => {
    const search = req.body["products-search"];
    if(search == "All Products") {
        res.redirect("/productDashboard");
    }else {
        productsModel.find({category:search})
    .then((products)=>{
        const filteredProducts = products.map(product=>{
            return {
                id: product._id,
                title: product.title,
                category: product.category,
                price: product.price,
                productImg: product.productImg,
                inventory: product.inventory,
                bestSeller: product.bestSeller
            }
        });
        res.render("products/productDashboard", {
            title: "Product Dashboard",
            productList: filteredProducts,
            search: search
        })
    })
    .catch(err=>console.log(`Error occoured when pulling from the database ${err}`));
    }
   
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
        description: req.body.description,
        bestSeller: (req.body.bestSeller ? true : false)
    }
    const product = new productsModel(newProduct);
    product.save()
    .then((product)=>{
        req.files.productImg.name = `pro_img_${product._id}${path.parse(req.files.productImg.name).ext}`;
        req.files.productImg.mv(`public/uploads/${req.files.productImg.name}`)
        .then(()=>{
            productsModel.updateOne({_id:product._id}, {
                productImg: req.files.productImg.name
            })
            .then(()=>{
                res.redirect(`/productDashboard`);
            })
        })
    })
    .catch(err=>console.log(`Error while inserting into the database ${err}`))
   
});



router.get("/shoppingCart", (req, res) => {
    res.render("products/shoppingCart", {
        title: `Shopping Cart`
    });
});

router.post("/custSearch", (req,res) => {
    const searchValue = req.body.search;

    productsModel.find()
    .then((products)=>{
        const filteredProducts = products.map(product=>{
            return {
                id: product._id,
                title: product.title,
                category: product.category,
                price: product.price,
                productImg: product.productImg,
                showBestSeller: (product.bestSeller ? "show-best-seller" : "hide-best-seller")
            }
        });
        const productList = [];
        filteredProducts.forEach((product)=>{
            if(product.title.toLowerCase().includes(searchValue.toLowerCase())) {
                productList.push(product);
            }
        });
        const notmatch = productList.length > 0 ? false : true;
        res.render("products/products", {
            title: "Search Result",
            searchValue: searchValue,
            hasValue: true,
            productList: productList,
            notmatch: notmatch
        })
    })
    .catch(err=>console.log(`Error occoured when pulling from the database ${err}`));

});


module.exports = router;