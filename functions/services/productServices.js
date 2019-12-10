let admin   = require('../config/firebaseConfig'),
    db      = admin.firestore();
    storage   = admin.storage();

module.exports.getAllProducts = () => {
    return db.collection('products').get()
        .then((products) => {
            let allProducts = [];
            products.forEach((event) => {
                let product = event.data();
                console.log("product no. ",product);
                allProducts.push({
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
            })
            console.log("flitered products are: ",allProducts);
            return allProducts;
        })
        .catch((err) => {
            console.log("error in getting users from getallusers service ",err);
        })
}

module.exports.addProduct = (product) => {
    var sellerId = product['sellerId'];
    return db.collection('products').add(product)
        .then((docRef) => {
            console.log("Ref obtained", docRef.id);
            console.log("seller id: ", sellerId);  
            db.runTransaction(transaction => {
                return transaction.get(db.collection("users").doc(sellerId)).then(snapshot => {
                    const array = snapshot.get('sold');
                    array.push(docRef.id);
                    transaction.update(db.collection("users").doc(sellerId), 'sold', array);
                    console.log("Updated User's product sold array");
                    transaction.update(db.collection('products').doc(docRef.id), {productId: docRef.id});
                    console.log('Updated product id');
                    
                });
            });
            return (docRef.id);
        })
}

module.exports.getSellerDetails = (sellerId) => {
    return db.collection('users').doc(sellerId).get()
        .then((seller) => { 
            console.log(seller.data());
            let _seller = seller.data();
            let sellerDetails = {
                name            : _seller['displayName'],
                overallRating   : _seller['overallRating'],
                photoUrl        : _seller['photoURL'],
                address         : "Coimbatore, TN"
            };
            
            console.log("seller details is: ",sellerDetails);
            return sellerDetails;
        })
        .catch((err) => {
            console.log("error in getting seller details from getSellerDetails service ",err);
        })
}