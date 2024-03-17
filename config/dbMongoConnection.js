const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.CONNECTION_STRING, {
    dbName: 'ecommerce-js',
})
.then(() => {
    console.log('Conexion a la base de datos funcionando!')
}).catch((err) => {
    console.log(err)
})
