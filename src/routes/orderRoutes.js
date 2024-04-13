const express = require('express');
const router = express.Router();
const { getOrders, 
    getOrder, 
    totalSales, 
    ordersCount, 
    userOrderList, 
    createOrder,
    deleteOrder,
    putOrder} = require('../controllers/orderController');
const LogUser = require('../middlewares/auth-require');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', LogUser, getOrders);
router.get('/:id', LogUser, getOrder);
router.post('/', LogUser, createOrder);
router.get('/get/totalsales', LogUser, isAdmin, totalSales);
router.get('/get/count', LogUser, ordersCount);
router.get('/get/userorders/:userid', LogUser, userOrderList);
router.put('/:id', LogUser, putOrder);
router.delete('/:id', LogUser, deleteOrder);

module.exports = router;