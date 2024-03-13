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

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', updatedProduct);
router.delete('/:id', deleteProduct);
router.get('/get/count', getCountProduct);
router.get('/get/featured/:count', getFeaturedProduct);
router.put('/gallery-images/:id', updatedGalleryImages);

module.exports = router;