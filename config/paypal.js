const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox',
    'host': 'api-m.sandbox.paypal.com',
    'client_id': process.env.PAYPAL_CLIENTID,
    'client_secret': process.env.PAYPAL_SECRET
})