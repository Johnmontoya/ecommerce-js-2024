const express = require('express')
const app = express();
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger.json');
const morgan = require('morgan');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const authJwt = require('../config/helpers/jwt');
const errorHandler = require('../config/helpers/error-handler');
const cors = require('cors');

const categoriaRutas = require('./routes/categoryRoutes');

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
app.use(`${api}/users`, userRouter);
app.use(`${api}/categorias`, categoriaRutas);

module.exports = app;