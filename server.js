const app = require('./src/app');
require('./config/dbMongoConnection');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto: ${port}`)
});

process.on('SIGINT', () => {
    app.close();
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});