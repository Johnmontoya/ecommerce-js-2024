const OrderRepository = require('../repositories/orderRepository');

class OrderService {
    constructor(){
        this.orderRepository = new OrderRepository;
    }

    async getAllOrders(){
        const orders = await this.orderRepository.getOrders();
        return orders;
    }

    async registerOrder(orderData){
        try {
            const order = await this.orderRepository.createOrder(orderData);
            return order;   
        } catch (error) {
            throw new Error('La orden no pudo ser creada');
        }
    }

    async getOneOrder(orderId){
        const order = await this.orderRepository.getOrderById(orderId);
        if(!order){
            throw new Error('Orden no encontrada');
        }
        return order;
    }

    async getTotalSales(){
        const total = await this.orderRepository.getTotalSales();
        if(!total){
            throw new Error('La orden de ventas no puede se generada')
        }
        return total;
    }

    async getOrdersCount(){
        const orders = await this.orderRepository.getCountOrder();
        if(orders === 0){
            throw new Error('No hay ordenes almacenadas')
        }
        return orders;
    }

    async getUserOrder(userId){
        const user = await this.orderRepository.getUserOrders(userId);
        if(user.length === 0){
            throw new Error('No se encontraron pedidos realizados por el usuario')
        }
        return user;
    }

    async updateOrder(orderId, orderData){
        const order = await this.orderRepository.putOrder(orderId, orderData);
        if(!order){
            throw new Error('Orden no encontrada');
        }
        return order;
    }

    async removeOrder(orderId){
        const order = await this.orderRepository.deleteOrder(orderId);
        if(!order){
            throw new Error('Orden no encontrada');
        }
        return order;
    }
}

module.exports = OrderService;