const express = require('express');
const router = express.Router();
const { createUser,
    getUsers,
    getUser,
    getUserCount,
    getEmail,
    updateUser,
    deleteUser,
    login,
    register,
    forgotPassword,
    resetPassword} = require('../controllers/usuarioController');
const LogUser = require('../middlewares/auth-require');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', LogUser, isAdmin, createUser);
router.get('/', LogUser, isAdmin, getUsers);
router.get('/:id', LogUser, getUser);
router.get('/get/count', LogUser, isAdmin, getUserCount);
router.get('/get/email', LogUser, getEmail);
router.post('/login', login);
router.post('/register', register);
router.post('/forgot', forgotPassword);
router.put('/reset', resetPassword);
router.put('/:id', LogUser, updateUser);
router.delete('/:id', LogUser, deleteUser);

module.exports = router;