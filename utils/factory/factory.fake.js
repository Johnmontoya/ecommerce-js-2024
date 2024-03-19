const { faker } = require('@faker-js/faker');
const { factory } = require('factory-girl');
const { Category } = require('../../src/models/category');
const { User } = require('../../src/models/user');
const { Product } = require('../../src/models/product');
const { Order } = require('../../src/models/order');
const { OrderItem } = require('../../src/models/order-item');

factory.define('category', Category, {
    name: factory.seq((n) => `${n}${faker.commerce.productAdjective()}`),
    icon: factory.seq((n) => `${n}${faker.internet.emoji()}`),
    color: factory.seq((n) => `${n}${faker.color.rgb({ format: 'hex', casing: 'lower'})}`)
})

factory.define('user', User, {
    name: factory.seq((n) => `${n}${faker.person.firstName()}`),
    email: factory.seq((n) => `${n}${faker.internet.email({ allowSpecialCharacters: true })}`),
    phone: factory.seq((n) => `${n}${faker.phone.number()}`),
    isAdmin: true,
    street: factory.seq((n) => `${n}${faker.location.streetAddress()}`),
    apartment: factory.seq((n) => `${n}${faker.location.street()}`),
    zip: factory.seq((n) => `${n}${faker.location.zipCode()}`),
    city: factory.seq((n) => `${n}${faker.location.city()}`),
    country: factory.seq((n) => `${n}${faker.location.country()}`)
})

factory.define('product', Product, {
    name: factory.seq((n) => `${n}${faker.commerce.productName()}`),
    description: factory.seq((n) => `${n}${faker.commerce.productDescription()}`),
    richDescription: factory.seq((n) => `${n}${faker.commerce.productDescription()}`),
    image: faker.image.url(),
    category: faker.database.mongodbObjectId().toString(),
    brand: factory.seq((n) => `${n}${faker.commerce.productMaterial()}`),
    price: factory.seq((n) => `${n}${faker.commerce.price()}`),
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
    shippingAddress1: factory.seq((n) => `${n}${faker.location.streetAddress()}`),
    shippingAddress2: factory.seq((n) => `${n}${faker.location.streetAddress()}`),
    city: factory.seq((n) => `${n}${faker.location.city()}`),
    zip: faker.location.zipCode(),
    country: factory.seq((n) => `${n}${faker.location.country()}`),
    phone: faker.phone.number(),
    status: 'pending',
    totalPrice: faker.number.int({ min: 1, max: 1000 }),
    user: faker.database.mongodbObjectId()
})

module.exports = factory;