const express = require('express');
const router = express.Router();
const { createProduct, 
    getProducts, 
    getProduct,
    updatedProduct,
    deleteProduct, 
    getCountProduct,
    getFeaturedProduct,
    updatedGalleryImages} = require('../controllers/productController');
const LogUser = require('../middlewares/auth-require');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', LogUser, isAdmin, createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', LogUser, isAdmin, updatedProduct);
router.delete('/:id', LogUser, isAdmin, deleteProduct);
router.get('/get/count', LogUser, isAdmin, getCountProduct);
router.get('/get/featured/:count', LogUser, isAdmin, getFeaturedProduct);
router.put('/gallery-images/:id', LogUser, isAdmin, updatedGalleryImages);

module.exports = router;