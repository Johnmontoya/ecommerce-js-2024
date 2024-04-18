const paypal = require('paypal-rest-sdk');
require('dotenv').config();

const { PAYPAL_CLIENTID, PAYPAL_SECRET } = process.env;
paypal.configure({
    'mode': 'sandbox',
    'host': 'api-m.sandbox.paypal.com',
    'client_id': PAYPAL_CLIENTID,
    'client_secret': PAYPAL_SECRET
})