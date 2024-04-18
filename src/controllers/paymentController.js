const paypal = require('paypal-rest-sdk');
const OrderService = require('../services/orderServices');
const UserService = require('../services/userServices');
const {preference, payments} = require('../../config/mercadopago');

const orderServices = new OrderService();
const usuarioService = new UserService();

require('../../config/paypal');
require('../../config/mercadopago');

async function CreatePaymentPaypal(req, res) {
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
            }],
            "note_to_payer": "Contact us for any questions on your order."
        };

        paypal.payment.create(create_payment, (error, payment) => {
            if(error) {
              console.log(error)
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

async function PaypalPaymentSuccess(req, res) {
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
            async function (error, payment) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    //console.log(JSON.stringify(payment));
                    order.bill.paymentId = paymentId;
                    order.status = 'Completed'
                    await order.save()
                    res.status(200).json({ message: 'Pago realizado correctamente'});
                }
            });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}



async function createPaymentMercado(req, res) {
    try {
        let orderId = req.params.id;
        const order = await orderServices.getOneOrder(orderId);
        
        let productItems = []
        order.orderItems.map((data) => {
            productItems.push({
                "id": data.product._id,
                "title": data.product.name,
                "description": data.product.description,
                "picture_url": data.product.image,
                "unit_price": data.product.price,
                "currency_id": "USD",
                "quantity": data.quantity              
            })
        })

        const user = await usuarioService.getUserId(order.user)
        let payer = {
          "name": user.name,
          "surname": user.name,
          "email": user.email,
          "phone": {
            "area_code": '+57',
            "number": user.phone
          },
          "address": {
            "zip_code": user.zip
          }
        }

        // Crear una preferencia de pago 

        preference
          .create({
            body: {
              items: productItems,
              marketplace_fee: 0,
              payer: payer,
              back_urls: {
                success: `http://localhost:3000/api/v1/payment/mercado/success?orderId=${orderId}`,
                failure: 'http://test.com/failure',
                pending: 'http://test.com/pending',
              },
              differential_pricing: {
                id: 1,
              },
              expires: false,
              additional_info: 'Discount: 12.00',
              auto_return: "approved",
              binary_mode: true,
              external_reference: '1643827245',
              marketplace: 'marketplace',
              notification_url: 'http://notificationurl.com',
              operation_type: 'regular_payment',
              payment_methods: {
                default_payment_method_id: '',
                excluded_payment_types: [
                  {
                    id: 'ticket',
                  },
                ],
                excluded_payment_methods: [
                  {
                    id: 'codensa',
                  },
                ],
                installments: 5,
                default_installments: 1,
              },
              shipments: {
                mode: 'not_specified',
                local_pickup: false,
                default_shipping_method: null,
                free_methods: [
                  {
                    id: 1,
                  },
                ],
                cost: 15000,
                free_shipping: false,
                dimensions: '10x10x20,500',
                receiver_address: {
                  zip_code: user.zip,
                  street_number: '',
                  street_name: user.street,
                  floor: '12',
                  apartment: user.apartment,
                  city_name: user.city,
                  country_name: user.country
                },
              },
              total_amount: order.totalPrice,
              statement_descriptor: 'ECOMMERCEJS',
            }
          })
          .then((data) => {
            console.log(data);
            res.status(201).json({
                message: data.api_response.status
            })
          })
          .catch((error) => {
            console.log(error);
          });

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function MercadoSuccess(req, res) {
    try {
      const {preference_id, payment_id, orderId} = req.query
      const order = await orderServices.getOneOrder(orderId);

      order.bill.preference = preference_id;
      order.bill.paymentId = payment_id;
      order.status = 'Completed'
      await order.save()

      res.status(200).json({
        message: 'Pago realizado correctamente'
      })

    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }
}

async function GetPaysMercado(req, res) {
    try {
      const {payment} = req.params
      const response = await preference.get({ preferenceId: payment });
      res.status(200).json({
        response
      })
    } catch (error) {
        res.status(500).json({
          error: error.message
        })
    }
}


module.exports = {
    CreatePaymentPaypal,
    PaypalPaymentSuccess,
    createPaymentMercado,
    MercadoSuccess,
    GetPaysMercado
}