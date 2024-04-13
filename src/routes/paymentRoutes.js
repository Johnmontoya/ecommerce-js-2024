const express = require('express');
const router = express.Router();
const LogUser = require('../middlewares/auth-require');
const { CreatePayment, PaymentSuccess } = require('../controllers/paymentController');

router.post('/:id', LogUser, CreatePayment);
router.get('/success', PaymentSuccess);
router.get('/cancel', (req, res) => res.send('Cancelled'));

module.exports = router;