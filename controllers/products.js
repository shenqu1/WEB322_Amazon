const express = require('express');
const router = express.Router();
const productsModel = require("../model/product");
const categoryModel = require("../model/category");
const path = require("path");

router.get("/", (req, res) => {

    categoryModel.find()
        .then((categories) => {
            const filteredCategories = categories.map((cat) => {
                return {
                    id: cat._id,
                    category: cat.category,
                    categoryImg: cat.categoryImg
                }
            });
            productsModel.find({
                    bestSeller: true
                })
                .then((products) => {
                    const filteredProducts = products.map(product => {
                        return {
                            id: product._id,
                            title: product.title,
                            productImg: product.productImg
                        }
                    });
                    res.render("products/home", {
                        title: `Home`,
                        cat: filteredCategories,
                        bestSellerInfo: filteredProducts
                    });
                })

        })

        .catch(err => console.log(`Error occoured when pulling from the database ${err}`));

});

router.get("/products", (req, res) => {
    productsModel.find()
        .then((products) => {
            const filteredProducts = products.map(product => {
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
            categoryModel.find()
        .then((categories) => {
            const filteredCategories = categories.map((cat) => {
                filteredProducts.forEach((pro)=>{
                    if(pro.category == cat.category) {
                        productList.push(pro);
                    }
                });
                return {
                    id: cat._id,
                    category: cat.category
                }
            });
            productList.sort((a, b) => {
                let x = a.category.toLowerCase();
                let y = b.category.toLowerCase();
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            });
            res.render("products/products", {
                title: "Product List",
                cat: filteredCategories,
                productList: productList
            });
        })      
        })
        .catch(err => console.log(`Error occoured when pulling from the database ${err}`));

});

router.post("/products/productsPage/search", (req, res) => {
    const search = req.body["products-search"];
    if (search == "all") {
        res.redirect("/products");
    } else {
        productsModel.find({
                category: search
            })
            .then((products) => {
                const filteredProducts = products.map(product => {
                    return {
                        id: product._id,
                        title: product.title,
                        category: product.category,
                        price: product.price,
                        productImg: product.productImg,
                    }
                });
                categoryModel.find()
                    .then((categories) => {
                        const filteredCategories = categories.map((cat) => {
                            return {
                                id: cat._id,
                                category: cat.category,
                                categoryImg: cat.categoryImg
                            }
                        });
                        filteredCategories.forEach((cat) => {
                            if (search == cat.category) {
                                cat.select = true;
                                cat.show = true;
                            }
                        });

                        res.render("products/products", {
                            title: "Product List",
                            productList: filteredProducts,
                            cat: filteredCategories
                        });

                    })
            })
            .catch(err => console.log(`Error occoured when pulling from the database ${err}`));
    }

});

router.get("/category/:id", (req,res)=>{
    
    categoryModel.find()
    .then((categories)=>{
        const filteredCategories = categories.map((cat) => {
            return {
                id: cat._id,
                category: cat.category
            }
        });
        let category = {};
        filteredCategories.forEach((cat)=>{
            if (cat.id == req.params.id) {
                category = cat;
                cat.select = true;
                cat.show = true;
            }
        });
        productsModel.find({category:category.category})
        .then((products)=>{
            const filteredProducts = products.map(product => {
                return {
                    id: product._id,
                    title: product.title,
                    category: product.category,
                    price: product.price,
                    productImg: product.productImg,
                    bestSeller: product.bestSeller
                }
            });
            res.render("products/products", {
                title: `Product List/${category.category}`,
                cat: filteredCategories,
                productList: filteredProducts,
            });
        })


    })
    .catch(err => console.log(`Error occoured when pulling from the database ${err}`));


})

router.get("/productDashboard", (req, res) => {
    productsModel.find()
        .then((products) => {
            const filteredProducts = products.map(product => {
                return {
                    id: product._id,
                    title: product.title,
                    category: product.category,
                    price: product.price,
                    description: product.description,
                    productImg: product.productImg,
                    inventory: product.inventory,
                    bestSeller: product.bestSeller
                }
            });
            filteredProducts.sort((a, b) => {
                let x = a.category.toLowerCase();
                let y = b.category.toLowerCase();
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            });
            categoryModel.find()
                .then((categories) => {
                    const filteredCategories = categories.map((cat) => {
                        return {
                            id: cat._id,
                            category: cat.category,
                            categoryImg: cat.categoryImg
                        }
                    });

                    res.render("products/productDashboard", {
                        title: "Product Dashboard",
                        productList: filteredProducts,
                        cat: filteredCategories
                    });

                })

        })
        .catch(err => console.log(`Error occoured when pulling from the database ${err}`));
});

router.get("/product/addCategory", (req, res) => {
    res.render("products/categoryAddForm", {
        title: `Add Category`
    });
});

router.post("/product/addCategory", (req, res) => {

    const errors = {
        title: `Add Category`,
        categoryValue: req.body.category
    };

    
    if(errors.categoryValue == "") {
        errors.category = `! Please enter category`;
        errors.display = true;
    }

    if(!req.files) {
        errors.files = `! Please upload category image`;
        errors.display = true;
    }else if(!req.files.categoryImg.mimetype.includes("image")){
        errors.files = "! Only image file type allowed";
        errors.display = true;
    }

    if (errors.display) {
        res.render("products/categoryAddForm", errors);
    } else {
        const newCategory = {
            category: req.body.category
        };
        const category = new categoryModel(newCategory);
        category.save()
            .then((cat) => {
                req.files.categoryImg.name = `cat_img_${cat._id}${path.parse(req.files.categoryImg.name).ext}`;
                req.files.categoryImg.mv(`public/uploads/${req.files.categoryImg.name}`)
                    .then(() => {
                        categoryModel.updateOne({
                                _id: cat._id
                            }, {
                                categoryImg: req.files.categoryImg.name
                            })
                            .then(() => {
                                res.redirect(`/productDashboard`);
                            })
                    })
            })
            .catch(err => console.log(`Error while inserting into the database ${err}`))
    }  

});

router.get("/category/edit/:id", (req,res)=>{
    categoryModel.findById(req.params.id)
    .then((cat)=>{

        const category = {
            id: cat._id,
            category: cat.category
        }
        
        res.render("products/categoryEditForm", {
            title: `Edit Category`,
            category: category
        });

    })
    .catch(err => console.log(`Error occoured when pulling from the database ${err}`));
});

router.put("/category/update/:id", (req,res)=>{

    const errors = {
        id: req.params.id,
        category: req.body.category
    };

    if(errors.category == "") {
        errors.error = "! Please enter category";
        errors.display = true;
    }

    if(req.files && !req.files.categoryImg.mimetype.includes("image")){
        errors.files = "! Only image file type allowed";
        errors.display = true;
    }

    if (errors.display) {
        res.render(`products/categoryEditForm`, {
            title: `Edit Category`,
            category: errors
        });
    } else {
    const category = {
        category: req.body.category,
    }
    if(req.files) {
        req.files.categoryImg.name = `cat_img_${req.params.id}${path.parse(req.files.categoryImg.name).ext}`;
        req.files.categoryImg.mv(`public/uploads/${req.files.categoryImg.name}`)
        .then(()=>{
            category.categoryImg = req.files.categoryImg.name;
        })
        .catch(err=>console.log(`Error occured when move files ${err}`));
    } 
    categoryModel.updateOne({_id:req.params.id}, category)
    .then(()=>{
        res.redirect(`/productDashboard`);
    })
    .catch(err => console.log(`Error occoured when updateing to the database ${err}`));
}
});

router.delete("/category/delete/:id", (req,res)=>{

    categoryModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect(`/productDashboard`);
    })
    .catch(err => console.log(`Error occoured when deleting from the database ${err}`));

});

router.get("/product/add", (req, res) => {
    categoryModel.find()
        .then((categories) => {
            const filteredCategories = categories.map((cat) => {
                return {
                    id: cat._id,
                    category: cat.category
                }
            });

            res.render("products/productAddForm", {
                title: `Add Products`,
                cat: filteredCategories
            });

        })
        .catch(err => console.log(`Error occoured when pulling from the database ${err}`));
});

router.post("/product/add", (req, res) => {

    categoryModel.find()
    .then((categories) => {
        const filteredCategories = categories.map((cat) => {
            return {
                id: cat._id,
                category: cat.category
            }
        });
    

    const errors = {
        titleValue: req.body.title,
        categoryValue: req.body.category,
        priceValue: req.body.price,
        inventoryValue: req.body.inventory,
        descriptionValue: req.body.description,
        bestSellerValue: (req.body.bestSeller ? true : false)
    };

    filteredCategories.forEach((cat)=>{
        if(errors.categoryValue == cat.category) {
            cat.show = true;
        }
    });

    if(errors.titleValue == "") {
        errors.title = "! Please enter product name";
        errors.display = true;
    }

    if(errors.priceValue == "") {
        errors.price = "! Please enter product price";
        errors.display = true;
    }
    if(errors.inventoryValue == "") {
        errors.inventory = "! Please enter product inventory";
        errors.display = true;
    }

    if(errors.descriptionValue == "") {
        errors.description = "! Please enter product description";
        errors.display = true;
    }

    if(!req.files) {
        errors.files = "! Please upload product image";
        errors.display = true;
    }else if(!req.files.productImg.mimetype.includes("image")){
        errors.files = "! Only image file type allowed";
        errors.display = true;
    }

    

    if (errors.display) {
        res.render("products/productAddForm", {
            title: `Add Products`,
            cat: filteredCategories,
            errors: errors
        });
    } else {

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
        .then((product) => {
            req.files.productImg.name = `pro_img_${product._id}${path.parse(req.files.productImg.name).ext}`;
            req.files.productImg.mv(`public/uploads/${req.files.productImg.name}`)
                .then(() => {
                    productsModel.updateOne({
                            _id: product._id
                        }, {
                            productImg: req.files.productImg.name
                        })
                        .then(() => {
                            res.redirect(`/productDashboard`);
                        })
                })
        })
        .catch(err => console.log(`Error while inserting into the database ${err}`))
    }
})
.catch(err => console.log(`Error occoured when pulling from the database ${err}`));
});

router.get("/product/edit/:id", (req,res)=>{
    productsModel.findById(req.params.id)
    .then((product)=>{

        const prod = {
            id: product._id,
            title: product.title,
            category: product.category,
            price: product.price,
            productImg: product.productImg,
            inventory: product.inventory,
            description: product.description,
            bestSeller: product.bestSeller
        }
        categoryModel.find()
        .then((categories) => {
            const filteredCategories = categories.map((cat) => {
                return {
                    id: cat._id,
                    category: cat.category
                }
            });
            filteredCategories.forEach((cat)=>{
                if(prod.category == cat.category) {
                    cat.show = true;
                }
            });

            res.render("products/productEditForm", {
                title: `Edit Products`,
                cat: filteredCategories,
                product: prod
            });

        })

    })
    .catch(err => console.log(`Error occoured when pulling from the database ${err}`));
});



router.put("/product/update/:id", (req,res)=>{

    categoryModel.find()
    .then((categories) => {
        const filteredCategories = categories.map((cat) => {
            return {
                id: cat._id,
                category: cat.category
            }
        });

    const errors = {
        id: req.params.id,
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        inventory: req.body.inventory,
        description: req.body.description,
        bestSeller: (req.body.bestSeller ? true : false)
    };

    filteredCategories.forEach((cat)=>{
        if(errors.category == cat.category) {
            cat.show = true;
        }
    });

    if(errors.title == "") {
        errors.titleError = "! Please enter product name";
        errors.display = true;
    }

    if(errors.price == "") {
        errors.priceError = "! Please enter product price";
        errors.display = true;
    }
    if(errors.inventory == "") {
        errors.inventoryError = "! Please enter product inventory";
        errors.display = true;
    }

    if(errors.description == "") {
        errors.descriptionError = "! Please enter product description";
        errors.display = true;
    }
    if(req.files && !req.files.productImg.mimetype.includes("image")){
        errors.files = "! Only image file type allowed";
        errors.display = true;
    }

    if (errors.display) {
        res.render(`products/productEditForm`, {
            title: `Edit Category`,
            cat: filteredCategories,
            product: errors
        });
    } else{

    const product = {
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        inventory: req.body.inventory,
        description: req.body.description,
        bestSeller: (req.body.bestSeller ? true : false)
    }
    if(req.files) {
        req.files.productImg.name = `pro_img_${req.params.id}${path.parse(req.files.productImg.name).ext}`;
        req.files.productImg.mv(`public/uploads/${req.files.productImg.name}`)
        .then(()=>{
            product.productImg = req.files.productImg.name;
        })
        .catch(err=>console.log(`Error occured when move files ${err}`));
    } 
    productsModel.updateOne({_id:req.params.id}, product)
    .then(()=>{
        res.redirect(`/productDashboard`);
    })
    .catch(err => console.log(`Error occoured when updateing to the database ${err}`));
}
    })
    .catch(err => console.log(`Error occoured when pulling from the database ${err}`));
});

router.delete("/product/delete/:id", (req,res)=>{

    productsModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect(`/productDashboard`);
    })
    .catch(err => console.log(`Error occoured when deleting from the database ${err}`));

});





router.post("/products/search", (req, res) => {
    const search = req.body["products-search"];
    if (search == "all") {
        res.redirect("/productDashboard");
    } else {
        productsModel.find({
                category: search
            })
            .then((products) => {
                const filteredProducts = products.map(product => {
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
                categoryModel.find()
                    .then((categories) => {
                        const filteredCategories = categories.map((cat) => {
                            return {
                                id: cat._id,
                                category: cat.category,
                                categoryImg: cat.categoryImg
                            }
                        });
                        filteredCategories.forEach((cat) => {
                            if (search == cat.category) {
                                cat.select = true;
                            }
                        });

                        res.render("products/productDashboard", {
                            title: "Product Dashboard",
                            productList: filteredProducts,
                            cat: filteredCategories
                        });

                    })
            })
            .catch(err => console.log(`Error occoured when pulling from the database ${err}`));
    }

});

router.get("/productDescription/:id", (req, res) => {
    productsModel.findById(req.params.id)
    .then((pro)=>{

        const product = {
            id: pro._id,
            title: pro.title,
            price: pro.price,
            productImg: pro.productImg,
            description: pro.description,
            inventory: pro.inventory,
            description: pro.description
        };
        if(product.inventory > 0) {
            product.stock = "In Stock";
            product.avalible = "inStock";
        } else {
            product.stock = "Out of Stock";
            product.avalible = "outStock";
        }
        res.render("products/productDescription", {
            title: `Product Description`,
            product: product
        });

    })
    .catch(err => console.log(`Error occoured when pulling from the database ${err}`));
    
});

router.post("/custSearch", (req, res) => {
    const searchValue = req.body.search;

    productsModel.find()
        .then((products) => {
            const filteredProducts = products.map(product => {
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
            filteredProducts.forEach((product) => {
                if (product.title.toLowerCase().includes(searchValue.toLowerCase())) {
                    productList.push(product);
                }
            });
            const notmatch = productList.length > 0 ? false : true;
            categoryModel.find()
            .then((categories) => {
                const filteredCategories = categories.map((cat) => {
                    return {
                        id: cat._id,
                        category: cat.category
                    }
                });
                res.render("products/products", {
                    title: "Search Result",
                    searchValue: searchValue,
                    hasValue: true,
                    productList: productList,
                    cat: filteredCategories,
                    notmatch: notmatch
                });
            }) 
           
        })
        .catch(err => console.log(`Error occoured when pulling from the database ${err}`));

});


module.exports = router;