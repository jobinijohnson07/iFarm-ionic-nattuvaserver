let admin   = require('../config/firebaseConfig'),
    db      = admin.firestore();

module.exports.sendNotification = (transactionId, buyerName, txn) => {
    var userId = txn['sellerId'];
    console.log("Sending notification to", userId);
    var FieldValue = require("firebase-admin").firestore.FieldValue;
    var token;
    var notification = {
        type            : 'Sold',
        title           : 'New Forward Contract',
        buyerName       : buyerName,
        productName     : txn['name'],
        quantity        : txn['quantity'],
        unit            : txn['unit'],
        transactionId   : transactionId
    };
    return db.collection('users').doc(userId).collection('notifications').add(notification)
        .then((docRef) =>  {
            db.runTransaction(transaction => {
                return transaction.get(db.collection('users').doc(userId).collection('notifications').doc(docRef.id)).then(snapshot => {
                    transaction.update(db.collection('users').doc(userId).collection('notifications').doc(docRef.id), {timestamp: FieldValue.serverTimestamp()});
                    console.log('Updated time');
                });
            });
            db.runTransaction(transaction => {
                return transaction.get(db.collection('users').doc(userId)).then(snapshot => {
                    token = snapshot.get('fcmToken');
                    console.log('FCM token: ', token);
                });
            }).then(() => {
                const payload = {
                    notification: {
                        title: 'Congratulations !!',
                        body: 'Your ' + txn['name'] + ' has been bought by ' + buyerName,
                    }
                }
                return admin.messaging().sendToDevice(token, payload);
            });
            
        });
}