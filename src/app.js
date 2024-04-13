const express = require('express')
const app = express();
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger.json');
const morgan = require('morgan');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const categoriaRutas = require('./routes/categoryRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const orderRouter = require('./routes/orderRoutes');
const errorHandler = require('./middlewares/error-handler');
const cors = require('cors');


const Authenticate = require('./middlewares/deserializer-auth');

require('dotenv/config')

const api = process.env.API_URL;

app.use(cors());
app.options('*', cors());

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(Authenticate);
app.use(errorHandler);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//api/v1
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/products`, productRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/categorias`, categoriaRutas);
app.use(`${api}/payment`, paymentRouter);

module.exports = app;