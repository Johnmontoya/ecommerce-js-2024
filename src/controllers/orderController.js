const { OrderItem } = require('../models/order-item');
const OrderService = require('../services/orderServices');
const { schemaOrders } = require('../models/schemas/schemaData');

const orderServices = new OrderService();

async function getOrders(req, res){
    try {
        const orders = await orderServices.getAllOrders();
        res.status(200).json({
            orders: orders
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function createOrder(req, res){
    try {
        //validate order
        const { error } = schemaOrders.validate(req.body);

        if (error) {
            return res.status(400).json(
                {error: error.message}
            )
        }

        const orderItemsIds = Promise.all(req.body.orderItems.map(async(orderItem) => {

            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            });

            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        }));

        const orderItemsIdsResolved = await orderItemsIds;

        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async(orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice;
        }));

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        let order = {
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user
        }

        const newOrder = await orderServices.registerOrder(order);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function getOrder(req, res){
    try {
        const orderId = req.params.id;
        const order = await orderServices.getOneOrder(orderId);
        res.status(200).json({
            order: order
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function totalSales(req, res){
    try {
        const totalSales = await orderServices.getTotalSales();
        res.status(200).json(
            { totalSales: totalSales.pop().totalsales }
        );
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function ordersCount(req, res){
    try {
        const orders = await orderServices.getOrdersCount();
        res.status(200).json({
            orders: orders
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function userOrderList(req, res){
    try {
        const userId = req.params.userid;
        const userList = await orderServices.getUserOrder(userId);
        res.status(200).json({
            userList: userList
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function putOrder(req, res){
    try {
        const orderId = req.params.id;
        const orderData = req.body.state;
        
        await orderServices.updateOrder(orderId, orderData);
        res.status(200).json({
            message: 'Orden actualizada'
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function deleteOrder(req, res){
    try {
        const orderId = req.params.id;
        await orderServices.removeOrder(orderId);
        res.status(200).json({
            message: 'Orden eliminada'
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

module.exports = {
    getOrders,
    createOrder,
    getOrder,
    totalSales,
    ordersCount,
    userOrderList,
    putOrder,
    deleteOrder
}