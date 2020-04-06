const express = require('express');
const router = express.Router();
const productsModel = require("../model/product");
const orderModel = require("../model/order");

router.post("/addToCart/:id", (req, res)=>{
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
        orderModel.findOne({userId:req.session.userInfo._id,productName:product.title})
        .then((order)=>{
            if(order){
                const qty = order.quantity + parseInt(req.body.quantity, 10);
                if(qty > product.inventory) {
                    product.error = `Not enough inventory, only ${product.inventory} left!`;
                    res.render("products/productDescription", {
                        title: `Product Description`,
                        product: product
                    });
                }else {
                    orderModel.updateOne({_id: order._id},{
                        quantity: qty
                    })
                    .then(
                        res.redirect("/order/shoppingCart")
                    )
                    .catch(err=>console.log(`${err}`));
                }
                
            } else {
                if(req.body.quantity > product.inventory) {
                    product.error = `Not enough inventory, only ${product.inventory} left!`;
                    res.render("products/productDescription", {
                        title: `Product Description`,
                        product: product
                    });
                }else {
                    const newOrder = {
                        userId: req.session.userInfo._id,
                        productName: product.title,
                        price: product.price,
                        quantity: req.body.quantity,
                        description: product.description,
                        productImg: product.productImg
                    }
                    const order = new orderModel(newOrder);
                    order.save()
                    .then(
                        res.redirect("/order/shoppingCart")
                    )
                    .catch(err=>console.log(`${err}`));
                }
            }
        })
        .catch(err=>console.log(`${err}`));
        
        
    })
    .catch(err=>console.log(`${err}`));
});

router.get("/shoppingCart", (req, res) => {


    orderModel.find({userId:req.session.userInfo._id})
    .then((orders)=>{

        const filterorders = orders.map(order => {
            return {
                id: order._id,
                userId: order.userId,
                productName: order.productName,
                price: order.price,
                quantity: order.quantity,
                description: order.description,
                productImg: order.productImg
            }
        });
        let total = 0;
        filterorders.forEach((order)=>{
            total += order.price * order.quantity;
        });
        res.render("order/shoppingCart", {
            title: `Shopping Cart`,
            orders: filterorders,
            isEmpty: (filterorders.length > 0 ? false : true),
            total: Math.floor((total + 0.005) * 100)/100
        });
    })
    .catch(err=>console.log(`${err}`));  
});

router.delete("/order/delete/:id",(req,res)=>{

    orderModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect(`/order/shoppingCart`);
    })
    .catch(err => console.log(`Error occoured when deleting from the database ${err}`));

});


module.exports = router;