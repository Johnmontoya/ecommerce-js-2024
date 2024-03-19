const mongoose = require('mongoose');
const faker = require('@faker-js/faker'); 
const bcrypt = require('bcryptjs');
const factory = require('../factory/factory.fake');
const { Category } = require('../../src/models/category');
const { User } = require('../../src/models/user');
const { Product } = require('../../src/models/product');
const { Order } = require('../../src/models/order');
require('../../config/dbMongoConnection');

const db = mongoose.connection;

db.on('error', async() => {
    console.error.bind(console, 'Error de conexión a la base de datos:')
});

db.once('open', async () => {
    console.log('Conexión exitosa a la base de datos');

    try {
        const categories = await factory.buildMany('category', 5);
        //console.log(categories)
        for(const category of categories) {
            await Category.create(category);
        }

        const users = await factory.buildMany('user', 5, {
            passwordHash: bcrypt.hashSync('pacoelflaco', 10),
        });
        //console.log(users)
        for(const user of users){
            await User.create(user)
        }

        const products = await factory.buildMany('product', 5);
        //console.log(products)
        for(const product of products){
            await Product.create(product)
        }

        const orders = await factory.buildMany('order', 5);
        //console.log(orders)
        for(const order of orders){
            await Order.create(order)
        }
        
        console.log('Seed completado, toda la información ha sido guardada');
    } catch (error) {
        console.error('Error al guardar los datos:', error);
    }
});