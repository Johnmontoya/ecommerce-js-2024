const express = require('express');
const router = express.Router();
const { createCategory, 
    getCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory } = require('../controllers/categoryController');
const LogUser = require('../middlewares/auth-require');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', LogUser, isAdmin, createCategory);
router.get('/', getCategories);
router.get('/:id', getCategory);
router.put('/:id', LogUser, isAdmin, updateCategory);
router.delete('/:id', LogUser, isAdmin, deleteCategory);

module.exports = router;