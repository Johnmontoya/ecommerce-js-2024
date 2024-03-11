const express = require('express')
const app = express();
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger.json');
const morgan = require('morgan');
const mongoose = require('mongoose')
const productRouter = require('./routers/product');
const categoryRouter = require('./routers/categories');
const userRouter = require('./routers/users');
const orderRouter = require('./routers/orders');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const cors = require('cors');

require('dotenv/config')

const api = process.env.API_URL;

app.use(cors());
app.options('*', cors());

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
//app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//api/v1
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);

mongoose.connect(process.env.CONNECTION_STRING, {
    dbName: 'ecommerce-js',
})
.then(() => {
    console.log('Database Connection is ready...')
}).catch((err) => {
    console.log(err)
})

app.listen(3000, () => {    
    console.log('server is running en localhost:3000');
})

module.exports = app;