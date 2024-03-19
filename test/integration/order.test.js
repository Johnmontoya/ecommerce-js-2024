const request = require('supertest');
const app = require('../../src/app');
const factory = require('../../utils/factory/factory.fake');

require('dotenv').config();

const url = process.env.API_URL
let orders;
beforeEach(async() => {
    orders = await factory.createMany('order', 2);
    //console.log(orders)
})

describe("Orders controller", () => {
    describe(`POST ${url}/orders`, () => {
        it('Deberia guardar el pedido y retornar code http: 201', async() => {
            try {
                const productData = await factory.create('product'); 
                const data = await factory.create('order');

                const response = await request(app)
                    .post(`${url}/orders`)
                    .set('content-type', 'application/json')
                    .send({
                        orderItems: [
                            {
                                quantity: data.orderItems[0].quantity,
                                product: productData._id
                            }
                        ],
                        shippingAddress1: data.shippingAddress1,
                        shippingAddress2: data.shippingAddress2,
                        city: data.city,
                        zip: data.zip,
                        country: data.country,
                        status: 'pending',
                        phone: data.phone,
                        user: data.user
                    })
                console.log(response.body)
                expect(response.statusCode).toBe(201);
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }            
        })
    })

    describe(`GET ${url}/orders`, () => {
        it('Debería retornar todas las ordenes con code http: 200', async () => {            
            try {
                const order = await request(app)
                    .get(`${url}/orders`)
                    .set("content-type", "application/json");
                expect(order.statusCode).toBe(200);
                expect(order.body).toHaveProperty("orders");
                expect(order.body.orders.length).toBeGreaterThan(0);
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        });
    });

    describe(`GET ${url}/orders/:id`, () => {
        it('Deberia retornar un solo pedido por su ID', async() => {
            try {
                const order = await request(app)
                    .get(`${url}/orders/${orders[1].id}`)
                    .set('content-type', 'application/json')
                
                expect(order.statusCode).toBe(200);
                expect(order.body).toHaveProperty('order');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 404 si el pedido con el ID no existe', async() => {
            try{
                const order = await request(app)
                    .get(`${url}/orders/639c80ef98284bfdf111ad09`)
                    .set('content-type', 'application/json')
                
                //console.log(categoria.body);
                expect(order.statusCode).toBe(404);
                expect(order.body).toHaveProperty('error');
            }catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }            
        })
    })

    describe(`GET ${url}/orders/get/totalsales`, () => {
        it('Deberia retornar la suma total de pedidos realizados', async() => {
            try {
                const total = await request(app)
                    .get(`${url}/orders/get/totalsales`)
                    .set('content-type', 'application/json');
                
                expect(total.statusCode).toBe(200);
                expect(total.body).toHaveProperty('totalSales');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`GET ${url}/orders/get/count`, () => {
        it('Deberia retornar el total de todas los pedidos', async() => {
            try {
                const count = await request(app)
                    .get(`${url}/orders/get/count`)
                    .set('content-type', 'application/json')

                expect(count.statusCode).toBe(200);
                expect(count.body).toHaveProperty('orders')
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`GET ${url}/orders/get/userorders/:id`, () => {
        it('Deberia retornar todos los pedidos realizados por un usuario', async() => {
            try {
                const order = await request(app)
                    .get(`${url}/orders/get/userorders/${orders[0].id}`)
                    .set('content-type', 'application/json')

                expect(order.statusCode).toBe(404);
                expect(order.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 404 si el pedido con el ID no existe', async() => {
            try{                
                const order = await request(app)
                    .get(`${url}/orders/get/userorders/639c80ef98284bfdf111ad09`)
                    .set('content-type', 'application/json')
                
                //console.log(categoria.body);
                expect(order.statusCode).toBe(404);
                expect(order.body).toHaveProperty('error');
            }catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }            
        })
    })

    describe(`PUT ${url}/orders/:id`, () => {
        it('Deberia poder actualizar el estado del pedido', async() => {
            try {
                const estado = await request(app)
                    .put(`${url}/orders/${orders[1].id}`)
                    .set('content-type', 'application/json')
                    .send({
                        state: 2
                    });

                expect(estado.statusCode).toBe(200);
                expect(estado.body).toHaveProperty('message');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`DELETE ${url}/orders/:id`, () => {
        it('Deberia poder eliminar el pedido y retornar un code http: 200', async() => {
            try {
                const remove = await request(app)
                    .delete(`${url}/orders/${orders[1].id}`)
                    .set('content-type', 'application/json');
                
                expect(remove.statusCode).toBe(200);
                expect(remove.body).toHaveProperty('message');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 404 si el pedido con el ID no existe', async() => {
            try{                
                const order = await request(app)
                    .delete(`${url}/orders/639c80ef98284bfdf111ad09`)
                    .set('content-type', 'application/json')
                
                //console.log(categoria.body);
                expect(order.statusCode).toBe(404);
                expect(order.body).toHaveProperty('error');
            }catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }            
        })
    })
});