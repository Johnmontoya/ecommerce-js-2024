const { get } = require('mongoose');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
        openapi: '3.0.0',
        info: {
        title: 'Ecommerce',
        version: '1.0.0',
        description: 'This is a REST API application made with express and retrieves data from JSONPlaceholder',
    },
    contact: {
        name: 'Ecommerce JS',
        url: 'https://github.com/Johnmontoya'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development Server'
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: ['./routers/*.js'], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;