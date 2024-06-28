[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

# Ecommerce

Proyecto basico con nodejs de una api ecommerce, hecho con js y vitejs, con jest para pruebas, documentacion con swagger, pagos con paypal, mercado pago y docker.


## TECNOLOGIAS

- [Nodejs]
- [Express]
- [Paypal]
- [Joi]
- [Faker]
- [Factory-Girl]
- [Mongoose]
- [Nodemailer]
- [Jest]
- [Swagger]
- [Paypal]
- [MercadoPago]
- [Docker]

## VARIABLES DE ENTORNO

- API_URL = /api/v1
- HOST_URL = 'http://localhost:3000/'
- SECRET = _tu secret password_
- CONNECTION_LOCAL = mongodb://localhost:27017/ecommerce-js-2024
- EMAIL_PORT = _puerto de la app de mensajeria_
- HOST_EMAIL = _host de la app de mensajeria_
- EMAIL_USER = _usuario de la app de mensajeria_
- EMAIL_PASSWORD = _password de la app de mensajeria_
- PAYPAL_CLIENTID = _clave cliente de paypal developer_
- PAYPAL_SECRET = _clave secreta de paypal developer_
- MERCADO_PAGOKEY = _clave de prueba de mercado pago developer_
- CONNECTION_DOCKER = mongodb://mongodb:27017/ecommerce-js-2024

## INSTALACION

Versión utilizada de Node (20.11)
```
cd backend
npm install
```

Luego de la instalacion 

```
npm build
npm start
```

Usar la targeta generada por paypal:
Fecha de expiración y cv pueden ser cualquiera.

#### Credit Card Paypal
```
4005519200000004
```

Para el nombre de usuario durante el proceso se puede usar los siguientes:
- APRO: Pago aprobado
- EXPI: La fecha de la tarjeta ha expirado
- FUND: Saldo insuficiente
- FORM: Rechazado a un error de formulario
- SECU: Rechazado por codigo de seguridad invalido
- CALL: Rechazado por validación para autorizar
- CONT: Pendiente de pago
- OTHE: Rechazado por error general 

#### Credit Card
```
4915 1120 5524 6507
ccv: 123
expire: 11/25
Nombre de usuario: APRO / EXPI / FUND
C.C: 123456789

```

### Nota:
Para hacer pruebas con mercado pago se debe tener 2 cuentas de prueba, 1 comprador y otro de venta él cuál generará el MERCADO_PAGOKEY que va en el archivo .env

# Instrucciones para Docker
Si quieres usar docker, sigue estos pasos:
- Descarga docker: [Docker].

Cambia la variable local usada en /config/dbMongoConnection.js por CONNECTION_DOCKER:

```
mongoose.connect(process.env.CONNECTION_DOCKER, {
    dbName: 'ecommerce-js-2024',
})
```

Corre el comando:

```
docker compose up --build -d
```

[Nodejs]: <https://nodejs.org/en>
[Express]: <https://expressjs.com/>
[Paypal]: <https://www.paypal.com/co>
[Joi]: <https://joi.dev/>
[Faker]: <https://fakerjs.dev/>
[Factory-Girl]: <https://www.npmjs.com/package/factory-girl>
[Mongoose]: <https://mongoosejs.com/>
[Nodemailer]: <https://www.nodemailer.com/>
[Jest]: <https://jestjs.io/>
[Swagger]: <https://swagger.io/>
[Paypal]: <https://www.npmjs.com/package/paypal-rest-sdk>
[MercadoPago]: <https://www.npmjs.com/package/mercadopago>
[Docker]: <https://www.docker.com/get-started/>