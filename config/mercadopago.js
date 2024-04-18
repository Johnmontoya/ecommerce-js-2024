const mercadopago = require('mercadopago');
require('dotenv').config();

const { MERCADO_PAGOKEY } = process.env;

const client = new mercadopago.MercadoPagoConfig({
    accessToken: MERCADO_PAGOKEY,
    options: { timeout: 5000, idempotencyKey: 'mercadopago' }
})

const preference = new mercadopago.Preference(client);
const payments = new mercadopago.Payment(client);

module.exports = {preference, payments};


        