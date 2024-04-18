const express = require('express');
const router = express.Router();
const LogUser = require('../middlewares/auth-require');
const { CreatePaymentPaypal, PaypalPaymentSuccess, createPaymentMercado, MercadoSuccess, GetPaysMercado } = require('../controllers/paymentController');

router.post('/:id', LogUser, CreatePaymentPaypal);
router.get('/success', PaypalPaymentSuccess);
router.get('/cancel', (req, res) => res.json({
    message: 'Pago cancelado'
}));

router.post('/mercado/:id', LogUser, createPaymentMercado);
router.get('/mercado/success', MercadoSuccess);
router.get('/list/mercado/:payment', GetPaysMercado);

module.exports = router;