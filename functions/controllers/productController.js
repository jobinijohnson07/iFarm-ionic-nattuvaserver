let productServices = require('../services/productServices');

module.exports.getAllProducts = (req,res) => {
    productServices.getAllProducts()
        .then((products) => {
            console.log("Products from productController ", products);
            res.send(products);
        })
        .catch((err) => {
            console.log("error from getAllProducts in productController", err);
            res.send(err);
        })
}

module.exports.addProduct = (req,res) => {
    let product = req.body;
    console.log("New product to be added", product);
    productServices.addProduct(product)
        .then((createdTime) => {
            console.log("Successfully added new product");
            res.send(createdTime);
        })
        .catch((err) => {
            console.log("error from addProduct in productController", err);
            res.send(err);
        })
}

module.exports.getSellerDetails = (req,res) => {
    let sellerId = req.params.id;
    console.log(sellerId);
    productServices.getSellerDetails(sellerId)
        .then((sellerDetails) => {
            console.log("Seller Details from productController ", sellerDetails);
            res.send(sellerDetails);
        })
        .catch((err) => {
            console.log("error from getsellerdetails in productController", err);
            res.send(err);
        })
}