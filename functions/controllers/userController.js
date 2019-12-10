let userServices = require('../services/userServices');

module.exports.getUserDetails = (req,res) => {
    let userId = req.params.id;
    console.log(userId);
    userServices.getUserDetails(userId)
        .then((userDetails) => {
            console.log("User Details from user Controller ", userDetails);
            res.send(userDetails);
        })
        .catch((err) => {
            console.log("error from getuserdetails in userController", err);
            res.send(err);
        })
}

module.exports.getSoldProducts = (req,res) => {
    let userId = req.params.id;
    console.log(userId);
    userServices.getSoldProducts(userId)
        .then((soldProducts) => {
            console.log("Sold Products Ids from userController ", soldProducts);
            res.send(soldProducts);
        })
        .catch((err) => {
            console.log("error from getSoldProducts in userController", err);
            res.send(err);
        })
}

module.exports.addToCart = (req,res) => {
    let userId = req.params.id;
    let productId = req.params.pid;
    console.log(userId);
    console.log("Productid to be added", productId)
    userServices.addToCart(userId, productId)
        .then((event) => {
            console.log("Added product to cart from userController ", event);
            res.send(event);
        })
        .catch((err) => {
            console.log("error from addToCart in userController", err);
            res.send(err);
        })
}

module.exports.deleteFromCart = (req,res) => {
    let userId = req.params.id;
    let productId = req.params.pid;
    console.log(userId);
    console.log("Productid to be deleted", productId)
    userServices.deleteFromCart(userId, productId)
        .then((event) => {
            console.log("Deleted product from cart from deleteFromCart in userController ", event);
            res.send(event);
        })
        .catch((err) => {
            console.log("error from deleteFromCart in userController", err);
            res.send(err);
        })
}

module.exports.getCart = (req,res) => {
    let userId = req.params.id;
    console.log(userId);
    userServices.getCart(userId)
        .then((event) => {
            console.log("Cart obtained from userController ", event);
            res.send(event);
        })
        .catch((err) => {
            console.log("error from getCart in userController", err);
            res.send(err);
        })
}

module.exports.addToWishlist = (req,res) => {
    let userId = req.params.id;
    let productId = req.params.pid;
    console.log(userId);
    console.log("Productid to be added in wishlist", productId)
    userServices.addToWishlist(userId, productId)
        .then((event) => {
            console.log("Added product to wishlist from addToWishlist in userController ", event);
            res.send(event);
        })
        .catch((err) => {
            console.log("error from addToWishlist in userController", err);
            res.send(err);
        })
}

module.exports.inWishlist = (req,res) => {
    let userId = req.params.id;
    let productId = req.params.pid;
    console.log(userId);
    console.log("Productid to check in wishlist", productId)
    userServices.inWishlist(userId, productId)
        .then((event) => {
            console.log("Product inWishlist in userController ", event);
            res.send(event);
        })
        .catch((err) => {
            console.log("error from inWishlist in userController", err);
            res.send(err);
        })
}

module.exports.getWishlist = (req,res) => {
    let userId = req.params.id;
    console.log(userId);
    userServices.getWishlist(userId)
        .then((event) => {
            console.log("Wishlist obtained from userController ", event);
            res.send(event);
        })
        .catch((err) => {
            console.log("error from getWishlist in userController", err);
            res.send(err);
        })
}

module.exports.deleteFromWishlist = (req,res) => {
    let userId = req.params.id;
    let productId = req.params.pid;
    console.log(userId);
    console.log("Productid to be deleted", productId);
    userServices.deleteFromWishlist(userId, productId)
        .then((event) => {
            console.log("Deleted product from wishlist from deleteFromWishlist in userController ", event);
            res.send(event);
        })
        .catch((err) => {
            console.log("error from deleteFromWishlist in userController", err);
            res.send(err);
        })
}

module.exports.sendNotification = (req,res) => {
    let notification = req.body;
    console.log("GOing to send notfication", notification);
    userServices.sendNotification(notification)
        .then((event) => {
            console.log("Notification sent", event);
            res.send(event);
        })
        .catch((err) => {
            console.log("error from notification in userController", err);
            res.send(err);
        })
}

module.exports.buyProduct = (req,res) => {
    let txn = req.body;
    let buyerId = req.params.id;
    console.log("GOing to buy product", txn);
    userServices.buyProduct(buyerId, txn)
        .then((event) => {
            console.log("Product Bought", event);
            res.send(event);
        })
        .catch((err) => {
            console.log("error from buyProduct in userController", err);
            res.send(err);
        })
}

module.exports.getContracts = (req,res) => {
    let userId = req.params.id;
    console.log("User Id: ", userId);
    userServices.getContracts(userId)
        .then((event) => {
            console.log("Contracts obtained from getContracts: userController ", event);
            res.send(event);
        })
        .catch((err) => {
            console.log("error from getContracts in userController", err);
            res.send(err);
        })
}

module.exports.updateFCM = (req,res) => {
    let body = req.body;
    let token = body['fcmToken'];
    let userId = req.params.id;
    console.log("Updating FCM token ", token);
    userServices.updateFCM(userId, token)
        .then((event) => {
            console.log("Updated token", event);
            res.send(event);
        })
        .catch((err) => {
            console.log("error from updateFCM in userController", err);
            res.send(err);
        })
}

module.exports.getNotifications = (req,res) => {
    let userId = req.params.id;
    console.log("Getting all notifications of ", userId);
    userServices.getNotifications(userId)
        .then((event) => {
            console.log("Obtained notification", event);
            res.send(event);
        })
        .catch((err) => {
            console.log("error from getNotifications in userController", err);
            res.send(err);
        })
}