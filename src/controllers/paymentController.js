const paypal = require('paypal-rest-sdk');
const OrderService = require('../services/orderServices');

const orderServices = new OrderService();
require('../../config/paypal');

async function CreatePayment(req, res) {
    try {
        let orderId = req.params.id;
        const order = await orderServices.getOneOrder(orderId);
        
        let productItems = []
        order.orderItems.map((data) => {
            productItems.push({
                "name": data.product.name,
                "sku": data.product.name,
                "price": data.product.price,
                "currency": "USD",
                "quantity": data.quantity
            })
        })

        let create_payment = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `http://localhost:3000/api/v1/payment/success?orderId=${orderId}`,
                "cancel_url": "http://localhost:3000/api/v1/payment/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": productItems
                },
                "amount": {
                    "currency": "USD",
                    "total": order.totalPrice
                },
                "description": "This is the payment description."
            }]
        };

        paypal.payment.create(create_payment, (error, payment) => {
            if(error) {
                res.status(500).json({
                    error: error.message
                })
            } else {
                const url = payment.links.find(link => link.rel === 'approval_url').href;
                res.json({ url })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}

async function PaymentSuccess(req, res) {
    try {
        let orderId = req.query.orderId;
        const order = await orderServices.getOneOrder(orderId);

        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": order.totalPrice
                }
            }]
        };

        paypal.payment.execute(paymentId,
            execute_payment_json,
            function (error, payment) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    console.log(JSON.stringify(payment));
                    res.status(200).json({ message: 'Success'});
                }
            });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    CreatePayment,
    PaymentSuccess
}