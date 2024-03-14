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

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.get('/get/totalsales', totalSales);
router.get('/get/count', ordersCount);
router.get('/get/userorders/:userid', userOrderList);
router.put('/:id', putOrder);
router.delete('/:id', deleteOrder);

module.exports = router;