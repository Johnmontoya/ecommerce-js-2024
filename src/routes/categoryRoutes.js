const express = require('express');
const router = express.Router();
const { createCategory, 
    getCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory } = require('../controllers/categoryController');

router.post('/create', createCategory);
router.get('/', getCategories);
router.get('/:id', getCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;