const express = require('express');
const router = express.Router();
const productsModel = require("../model/product");
const orderModel = require("../model/order");
const isAuthenticated = require("../middleware/authentication");

router.post("/addToCart/:id", isAuthenticated, (req, res) => {
    productsModel.findById(req.params.id)
        .then((pro) => {
            const product = {
                id: pro._id,
                title: pro.title,
                price: pro.price,
                productImg: pro.productImg,
                description: pro.description,
                inventory: pro.inventory,
                description: pro.description
            };
            orderModel.findOne({
                    userId: req.session.userInfo._id,
                    productId: product.id
                })
                .then((order) => {
                    if (order) {
                        const qty = order.quantity + parseInt(req.body.quantity, 10);
                        if (qty > product.inventory) {
                            product.error = `Not enough inventory, only ${product.inventory} left!`;
                            res.render("products/productDescription", {
                                title: `Product Description`,
                                product: product
                            });
                        } else {
                            orderModel.updateOne({
                                    _id: order._id
                                }, {
                                    quantity: qty
                                })
                                .then(() => {
                                    res.redirect("/order/shoppingCart");
                                })
                                .catch(err => console.log(`${err}`));
                        }

                    } else {
                        if (req.body.quantity > product.inventory) {
                            product.error = `Not enough inventory, only ${product.inventory} left!`;
                            res.render("products/productDescription", {
                                title: `Product Description`,
                                product: product
                            });
                        } else {
                            const newOrder = {
                                userId: req.session.userInfo._id,
                                productId: product.id,
                                productName: product.title,
                                price: product.price,
                                quantity: req.body.quantity,
                                description: product.description,
                                productImg: product.productImg
                            }
                            const order = new orderModel(newOrder);
                            order.save()
                                .then(() => {
                                    res.redirect("/order/shoppingCart");
                                })
                                .catch(err => console.log(`${err}`));
                        }
                    }
                })
                .catch(err => console.log(`${err}`));


        })
        .catch(err => console.log(`${err}`));
});

router.get("/shoppingCart", isAuthenticated, (req, res) => {


    orderModel.find({
            userId: req.session.userInfo._id
        })
        .then((orders) => {

            const filterorders = orders.map(order => {
                return {
                    id: order._id,
                    userId: order.userId,
                    productId: order.productId,
                    productName: order.productName,
                    price: order.price,
                    quantity: order.quantity,
                    description: order.description,
                    productImg: order.productImg
                }
            });
            let total = 0;
            filterorders.forEach((order) => {
                total += order.price * order.quantity;
            });
            res.render("order/shoppingCart", {
                title: `Shopping Cart`,
                orders: filterorders,
                isEmpty: (filterorders.length > 0 ? false : true),
                total: Math.floor((total * 1.13 + 0.005) * 100) / 100
            });
        })
        .catch(err => console.log(`${err}`));
});

router.delete("/order/delete/:id", isAuthenticated, (req, res) => {

    orderModel.deleteOne({
            _id: req.params.id
        })
        .then(() => {
            res.redirect(`/order/shoppingCart`);
        })
        .catch(err => console.log(`Error occoured when deleting from the database ${err}`));

});

router.delete("/checkOut", isAuthenticated, (req, res) => {

    let error = false;
    let total = 0;

    productsModel.find()
        .then((products) => {
            const filteredProducts = products.map(product => {
                return {
                    id: product._id,
                    inventory: product.inventory
                }
            });
            orderModel.find({
                    userId: req.session.userInfo._id
                })
                .then((orders) => {

                    const filterorders = orders.map(order => {
                        return {
                            id: order._id,
                            userId: order.userId,
                            productId: order.productId,
                            productName: order.productName,
                            price: order.price,
                            quantity: order.quantity,
                            description: order.description,
                            productImg: order.productImg
                        }
                    });

                    if (filterorders.length > 0) {
                        for (let i = 0; i < filterorders.length; i++) {
                            total += filterorders[i].price * filterorders[i].quantity;
                            for (let j = 0; j < filteredProducts.length; j++) {
                                if (filterorders[i].productId == filteredProducts[j].id) {
                                    filterorders[i].inventory = filteredProducts[j].inventory;
                                    if (filterorders[i].quantity > filteredProducts[j].inventory) {
                                        error = true;
                                        filterorders[i].errorMessage = "Not Enough Inventory!";
                                    }
                                }
                            }
                        } 
                        if (error) {
                            res.render("order/shoppingCart", {
                                title: `Shopping Cart`,
                                orders: filterorders,
                                isEmpty: (filterorders.length > 0 ? false : true),
                                total: Math.floor((total * 1.13 + 0.005) * 100) / 100
                            });
                        } else {
                            let record = "";
                            filterorders.forEach((order) => {
                                record += `<img src="https://web322-amazon-project.herokuapp.com/uploads/${order.productImg}" alt="${order.productName}" width="100"><p>${order.productName}: $${order.price} * ${order.quantity}</p><hr>`
                                productsModel.updateOne({
                                        _id: order.productId
                                    }, {
                                        inventory: order.inventory - order.quantity
                                    })
                                    .then()
                                    .catch(err => console.log(`${err}`));
                            });
                            orderModel.deleteMany({
                                    userId: req.session.userInfo._id
                                })
                                .then(() => {
                                    record += `<p>Tax: 13%</p><p>Total: $${Math.floor((total * 1.13 + 0.005) * 100) / 100}</p>`
                                    const sgMail = require('@sendgrid/mail');
                                    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                                    const msg = {
                                        to: `${req.session.userInfo.email}`,
                                        from: `squ7@myseneca.ca`,
                                        subject: `Your Order`,
                                        html: `<h1>Hi ${req.session.userInfo.name}!<br> Congratulations!</h1>
                                    <p> You have successfully purchased:</p>
                                    ${record}
                                    <p>Visit our website: <a href="https://web322-amazon-project.herokuapp.com/">https://web322-amazon-project.herokuapp.com/</a></p>`
                                    };
                                    sgMail.send(msg)
                                        .then(() => {
                                            res.redirect("/order/shoppingCart");
                                        })
                                        .catch(err => {
                                            console.log(`Error ${err}`);
                                        });

                                })
                                .catch(err => console.log(`${err}`));
                        }
                    } else {
                        res.redirect("/order/shoppingCart");
                    }

                })
                .catch(err => console.log(`${err}`));



        })
        .catch(err => console.log(`${err}`));

});


module.exports = router;