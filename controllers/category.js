const express = require('express');
const router = express.Router();
const categoryModel = require("../model/category");
const path = require("path");
const isAuthenticated = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");

router.get("/addCategory", isAuthenticated, isAdmin, (req, res) => {
    res.render("category/categoryAddForm", {
        title: `Add Category`
    });
});

router.post("/addCategory", isAuthenticated, isAdmin, (req, res) => {

    const errors = {
        title: `Add Category`,
        categoryValue: req.body.category
    };


    if (errors.categoryValue == "") {
        errors.category = `! Please enter category`;
        errors.display = true;
    }

    if (!req.files) {
        errors.files = `! Please upload category image`;
        errors.display = true;
    } else if (!req.files.categoryImg.mimetype.includes("image")) {
        errors.files = "! Only image file type allowed";
        errors.display = true;
    }

    if (errors.display) {
        res.render("category/categoryAddForm", errors);
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

router.get("/category/edit/:id", isAuthenticated, isAdmin, (req, res) => {
    categoryModel.findById(req.params.id)
        .then((cat) => {

            const category = {
                id: cat._id,
                category: cat.category
            }

            res.render("category/categoryEditForm", {
                title: `Edit Category`,
                category: category
            });

        })
        .catch(err => console.log(`Error occoured when pulling from the database ${err}`));
});

router.put("/category/update/:id", isAuthenticated, isAdmin, (req, res) => {

    const errors = {
        id: req.params.id,
        category: req.body.category
    };

    if (errors.category == "") {
        errors.error = "! Please enter category";
        errors.display = true;
    }

    if (req.files && !req.files.categoryImg.mimetype.includes("image")) {
        errors.files = "! Only image file type allowed";
        errors.display = true;
    }

    if (errors.display) {
        res.render(`category/categoryEditForm`, {
            title: `Edit Category`,
            category: errors
        });
    } else {
        const category = {
            category: req.body.category,
        }
        if (req.files) {
            req.files.categoryImg.name = `cat_img_${req.params.id}${path.parse(req.files.categoryImg.name).ext}`;
            req.files.categoryImg.mv(`public/uploads/${req.files.categoryImg.name}`)
                .then(() => {
                    category.categoryImg = req.files.categoryImg.name;
                })
                .catch(err => console.log(`Error occured when move files ${err}`));
        }
        categoryModel.updateOne({
                _id: req.params.id
            }, category)
            .then(() => {
                res.redirect(`/productDashboard`);
            })
            .catch(err => console.log(`Error occoured when updateing to the database ${err}`));
    }
});

router.delete("/category/delete/:id", isAuthenticated, isAdmin, (req, res) => {

    categoryModel.deleteOne({
            _id: req.params.id
        })
        .then(() => {
            res.redirect(`/productDashboard`);
        })
        .catch(err => console.log(`Error occoured when deleting from the database ${err}`));

});

module.exports = router;