const express = require('express');
const router = express.Router();
const { createUser,
    getUsers,
    getUser,
    getUserCount,
    updateUser,
    deleteUser,
    login} = require('../controllers/usuarioController');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/get/count', getUserCount);
router.post('/login', login);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;