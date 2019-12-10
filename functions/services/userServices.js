let admin   = require('../config/firebaseConfig'),
    db      = admin.firestore(),
    contractService  = require('./contractService'),
    fcmService = require('./fcmService');


module.exports.getUserDetails = (userId) => {
    return db.collection('users').doc(userId).get()
        .then((user) => { 
            console.log(user.data());
            let _user = user.data();
            let userDetails = {
                name            : _user['displayName'],
                email           : _user['email'],
                photoURL        : _user['photoURL'],
            };
            
            console.log("user details is: ",userDetails);
            return userDetails;
        })
        .catch((err) => {
            console.log("error in getting user details from getuserDetails service ",err);
        })
}

module.exports.addToCart = (userId, productId) => {
    return db.runTransaction(transaction => {
        return transaction.get(db.collection("users").doc(userId)).then(snapshot => {
            const array = snapshot.get('cart');
            let index = array.indexOf(productId);
            console.log("Index of product", index);
            if(index == -1){
                array.push(productId);
                transaction.update(db.collection("users").doc(userId), 'cart', array);
                console.log("Added to Cart : addToCart Service");
                return productId;
            }
            else {
                return "In Cart";
            }
        });
    });
}

module.exports.deleteFromCart = (userId, productId) => {
    return db.runTransaction(transaction => {
        return transaction.get(db.collection("users").doc(userId)).then(snapshot => {
            const array = snapshot.get('cart');
            let index = array.indexOf(productId);
            console.log("Index of product", index);
            if(index > -1){
                array.splice(index,1);
                transaction.update(db.collection("users").doc(userId), 'cart', array);
                console.log("Added to Cart : deleteFromCart Service");
                return productId;
            }
            else {
                return "Not In Cart";
            }
        });
    });
}

module.exports.getCart = (userId) => {
    return db.runTransaction(transaction => {
        return transaction.get(db.collection("users").doc(userId)).then(snapshot => {
            const array = snapshot.get('cart');
            var products = [];
            console.log("Products in cart", array);
            array.forEach((productId) => {
                transaction.get(db.collection("products").doc(productId)).then(snapshot => {
                    const product = snapshot.data();
                    console.log("Product no.", product);
                    products.push(product);
                });
            });
            return products;
        });
    });
}

module.exports.getSoldProducts = (userId) => {    
    return db.collection('products').get()
        .then((products) => {
            let soldProducts = []; 
            products.forEach((event) => {
                let product = event.data();
                if(product.sellerId == userId){
                    console.log("Sold product. ",product);
                    soldProducts.push({
                        productId           : product.productId,
                        name                : product.name,
                        category            : product.category,
                        price               : product.price,
                        quantity            : product.quantity,
                        unit                : product.unit,
                        imageUrl            : product.imageUrl,
                        deliveryDate        : product.deliveryDate,
                        isForwardContract   : product.isForwardContract,
                        sellerId            : product.sellerId
                    });
                }
            })
            console.log('Filtered Sold products are',soldProducts);
            return soldProducts;
            // let products = await db.collection('products').get();
            // products.forEach((event) => {
            //     let product = event.data();
            //     if(productIds[0] == product.productId){
            //         console.log("product no. ",product);
            //         soldProducts.push(product);
            //     }
            // });
        })
        .catch((err) => {
            console.log("error in getting user details from getSoldProducts service ",err);
        });
}

module.exports.addToWishlist = (userId, productId) => {
    return db.runTransaction(transaction => {
        return transaction.get(db.collection("users").doc(userId)).then(snapshot => {
            const array = snapshot.get('wishlist');
            let index = array.indexOf(productId);
            console.log("Index of product", index);
            if(index == -1){
                array.push(productId);
                transaction.update(db.collection("users").doc(userId), 'wishlist', array);
                console.log("Added to Wishlist : addToWishlist Service");
                return productId;
            }
            else {
                return "In Wishlist";
            }
        });
    });
}

module.exports.inWishlist = (userId, productId) => {
    return db.runTransaction(transaction => {
        return transaction.get(db.collection("users").doc(userId)).then(snapshot => {
            const array = snapshot.get('wishlist');
            let index = array.indexOf(productId);
            console.log("Index of product", index);
            if(index == -1){
                return "false";
            }
            else {
                return "true";
            }
        });
    });
}

module.exports.getWishlist = (userId) => {
    return db.runTransaction(transaction => {
        return transaction.get(db.collection("users").doc(userId)).then(snapshot => {
            const array = snapshot.get('wishlist');
            var products = [];
            console.log("Products in wishlist", array);
            array.forEach((productId) => {
                transaction.get(db.collection("products").doc(productId)).then(snapshot => {
                    const product = snapshot.data();
                    console.log("Product no.", product);
                    products.push(product);
                });
            });
            return products;
        });
    });
}

module.exports.deleteFromWishlist = (userId, productId) => {
    return db.runTransaction(transaction => {
        return transaction.get(db.collection("users").doc(userId)).then(snapshot => {
            const array = snapshot.get('wishlist');
            let index = array.indexOf(productId);
            console.log("Index of product", index);
            if(index > -1){
                array.splice(index,1);
                transaction.update(db.collection("users").doc(userId), 'wishlist', array);
                console.log("Removed from Cart : deleteFromWishlist Service");
                return productId;
            }
            else {
                return "Not In Wishlist";
            }
        });
    });
}

module.exports.buyProduct = (buyerId, txn) => {
    var sellerId = txn['sellerId'];
    var FieldValue = require("firebase-admin").firestore.FieldValue;
    var name;
    return db.collection('transactions').add(txn)
        .then((docRef) => {
            console.log("Ref obtained", docRef.id);
            console.log("seller id: ", sellerId);  
            console.log("buyer id: ", sellerId);  
            db.runTransaction(transaction => {
                return transaction.get(db.collection("users").doc(buyerId)).then(snapshot => {
                    const array = snapshot.get('pendingTransactions');
                    name = snapshot.get('displayName');
                    const photoUrl = snapshot.get('photoURL');
                    array.push(docRef.id);
                    transaction.update(db.collection("users").doc(buyerId), 'pendingTransactions', array);
                    console.log("Updated Buyer's pendingTransactions array");
                    transaction.update(db.collection('transactions').doc(docRef.id), {
                        transactionId: docRef.id, 
                        isPending: true,
                        buyerName: name,
                        buyerPhotoUrl: photoUrl,
                        timestamp: FieldValue.serverTimestamp()
                    });
                    console.log('Updated transaction id');
                }).then(() => {
                    return fcmService.sendNotification(docRef.id, name, txn);
                });
                
            });
            db.runTransaction(transaction => {
                return transaction.get(db.collection("users").doc(sellerId)).then(snapshot => {
                    const array = snapshot.get('pendingTransactions');
                    array.push(docRef.id);
                    transaction.update(db.collection("users").doc(sellerId), 'pendingTransactions', array);
                    console.log("Updated Seller's pendingTransactions array");
                });
            });
                
            contractService.issueContract(txn,buyerId)
            .then(txnReceipt => {
                console.log("txn receipt received is ",txnReceipt);
                console.log("transaction hash",txnReceipt.data.transactionHash);
                db.runTransaction(transaction => {
                    return transaction.get(db.collection("transactions").doc(docRef.id)).then(snapshot => {
                        transaction.update(db.collection('transactions').doc(docRef.id), {
                            transactionHash: txnReceipt.data.transactionHash
                        });
                    });
                });
            });
            return docRef.id
        })
}

module.exports.getContracts = (userId) => {
    return db.runTransaction(transaction => {
        return transaction.get(db.collection("users").doc(userId)).then(snapshot => {
            const array = snapshot.get('pendingTransactions');
            var contracts = [];
            console.log("Contracts of user ", array);
            array.forEach((transactionId) => {
                transaction.get(db.collection("transactions").doc(transactionId)).then(snapshot => {
                    const contract = snapshot.data();
                    console.log("Product no.", contract);
                    contracts.push(contract);
                });
            });
            return contracts;
        });
    });
}

module.exports.updateFCM = (userId, token) => {
    return db.runTransaction(transaction => {
        return transaction.get(db.collection("users").doc(userId)).then(snapshot => {
            var fcmToken = snapshot.get('fcmToken');
            console.log("Old FCM Token of user ", fcmToken);
            fcmToken = token;
            console.log("Updated FCM Token of user ", fcmToken);
            transaction.update(db.collection("users").doc(userId), 'fcmToken', fcmToken);
            return "Updated FCM token";
        });
    });
}
module.exports.getNotifications = (userId) => {
    const query = db.collection('users').doc(userId).collection('notifications').orderBy('timestamp', 'desc')
    return query.get()
    .then((notificationData) => {
        let notifications = [];
        notificationData.forEach((event) => {
            let notification = event.data();
            console.log("Notification no. ",notification);
            notifications.push(notification);
        });
        console.log("Notifications of user", notifications);
        return notifications;
    });
}

