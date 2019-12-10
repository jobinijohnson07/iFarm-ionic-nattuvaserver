let express             = require('express'),
    router              = express.Router(),
    productController   = require('../controllers/productController');

router.get('', productController.getAllProducts);
router.post('',productController.addProduct);
router.get('/seller/:id', productController.getSellerDetails);

module.exports=router;