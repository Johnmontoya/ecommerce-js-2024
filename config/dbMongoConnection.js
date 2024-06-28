const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.CONNECTION_LOCAL, {
    dbName: 'ecommerce-js-2024',
})
.then(() => {
    console.log('Conexion a la base de datos funcionando!')
}).catch((err) => {
    console.log(err)
})
