const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { factory } = require('factory-girl');
const { Category } = require('../../src/models/category');
const { User } = require('../../src/models/user');
const { Product } = require('../../src/models/product');
const { Order } = require('../../src/models/order');
const { OrderItem } = require('../../src/models/order-item');

factory.define('category', Category, {
    name: faker.commerce.productAdjective(),
    icon: faker.internet.emoji(),
    color: faker.color.rgb({ format: 'hex', casing: 'lower'})
})

factory.define('user', User, {
    name: faker.person.firstName(),
    email: faker.internet.email({ allowSpecialCharacters: true }),
    phone: faker.phone.number(),
    isAdmin: true,
    street: faker.location.streetAddress(),
    apartment: faker.location.street(),
    zip: faker.location.zipCode(),
    city: faker.location.city(),
    country: faker.location.country()
})

factory.define('product', Product, {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    richDescription: faker.commerce.productDescription(),
    image: '',
    category: faker.database.mongodbObjectId(),
    brand: faker.commerce.productMaterial(),
    price: faker.commerce.price(),
    countInStock: faker.number.int(100),
    rating: faker.number.int({ min: 1, max: 5}),
    numReviews: faker.number.int(),
    isFeatured: true
})

factory.define('orderItem', OrderItem, {
    quantity: faker.number.int({ min: 1, max: 1000}),
    product: faker.database.mongodbObjectId().toString()
})

factory.define('order', Order, {
    orderItems: factory.assocMany('orderItem', 2),
    shippingAddress1: faker.location.streetAddress(),
    shippingAddress2: faker.location.streetAddress(),
    city: faker.location.city(),
    zip: faker.location.zipCode(),
    country: faker.location.country(),
    phone: faker.phone.number(),
    status: 'pending',
    totalPrice: faker.number.int({ min: 1, max: 1000 }),
    user: faker.database.mongodbObjectId()
})

module.exports = factory;