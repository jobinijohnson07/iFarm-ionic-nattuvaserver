let express             = require('express'),
    router              = express.Router(),
    userController   = require('../controllers/userController');

router.get('/:id/sold', userController.getSoldProducts);
// Cart
router.post('/:id/cart/:pid', userController.addToCart);
router.delete('/:id/cart/:pid', userController.deleteFromCart);
router.get('/:id/cart', userController.getCart);

//Wishlist
router.post('/:id/wishlist/:pid', userController.addToWishlist);
router.get('/:id/wishlist/:pid', userController.inWishlist);
router.delete('/:id/wishlist/:pid', userController.deleteFromWishlist);
router.get('/:id/wishlist', userController.getWishlist);

// User details
router.get('/:id', userController.getUserDetails);

// Buy
router.post('/:id/buy',userController.buyProduct);

//Contracts
router.get('/:id/contracts', userController.getContracts);

//FCM
router.patch('/:id/fcm', userController.updateFCM);
router.get('/:id/notifications', userController.getNotifications);

module.exports=router;