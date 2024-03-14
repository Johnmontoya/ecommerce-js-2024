const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');

class OrderRepository {
    async getOrders(){
        try {
            const orders = await Order.find()
                .populate('user', 'name')
                .sort({ dateOrdered: -1});
            return orders;
        } catch (error) {
            throw new Error('Error al obtener las ordenes: ' + error.message);
        }
    }

    async createOrder(orderData){
        try {
            const order = await Order.create(orderData);
            return order;
        } catch (error) {
            throw new Error('Error al crear la orden: ' + error.message);
        }
    }

    async getOrderById(orderId){
        try {
            const order = await Order.findById(orderId)
                .populate('user', 'name')
                .populate({
                    path: 'orderItems', populate: {
                        path: 'product', populate: 'category'
                    }
                });
                return order;
        } catch (error) {
            throw new Error('Error al obtener la orden: ' + error.message);
        }
    }

    async getTotalSales(){
        try {
            const totalSales = await Order.aggregate([
                { $group: { _id: null, totalsales: { $sum: '$totalPrice' }}}
            ]);
            return totalSales;
        } catch (error) {
            throw new Error('Error al obtener el total de ventas: ' + error.message);
        }
    }

    async getCountOrder(){
        try {
            const orderCount = await Order.countDocuments();
            return orderCount;
        } catch (error) {
            throw new Error('Error al obtener el conteo de ordenes: ' + error.message);
        }
    }

    async getUserOrders(userId){
        try {
            const userOrder = await Order.find({
                user: userId
            }).populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: 'category'
                }
            }).sort({ 'dateOrdered': -1 });
            return userOrder;
        } catch (error) {
            throw new Error('Error al obtener los pedidos del usuario: ' + error.message )
        }
    }

    async putOrder(orderId, orderData){
        try {
            const state = await Order.findById(orderId);
            console.log('repo', orderData);
            switch(orderData){
                case 1:
                    state.status = 'pending';
                    await state.save();                    
                    break;
                case 2:
                    state.status = 'sending';
                    await state.save();
                    break;
                case 3:
                    state.status = 'completed';
                    await state.save();
                    break;
                default:
                    state.status = 'pending'
                    await state.save();
            }
            return state.status;    
            
        } catch (error) {
            throw new Error('Error al actualizar la orden: ' + error.message);
        }
    }

    async deleteOrder(orderId){
        try {
            const order = await Order.findByIdAndDelete(orderId);
            if(!orderId){
                throw new Error('No se encontró la orden')
            }

            for(const orderItem of order.orderItems){
                await OrderItem.findByIdAndDelete(orderItem);
            }

            return order;
        } catch (error) {
            throw new Error('Error al eliminar la orden: ' + error.message);
        }
    }
}

module.exports = OrderRepository;