# Ecommerce

Proyecto basico con nodejs de una api ecommerce, hecho con js y vitejs, con jest para pruebas, documentacion con swagger, pagos con paypal y mercado pago.


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

## INSTALACION

Versión utilizada de Node (20.11)
```
cd backend
npm install
```

Usar la targeta generada por paypal:
Fecha de expiración y cv pueden ser cualquiera.

```
[label Credit card]
4005519200000004
```

Para mercado pago se puede usar el siguiente usuario el cuál tiene un monto de 100k pesos, pero si el monto de la compra excede ese valor, se tendrá que usar la tarjeta debito. Para el nombre de usuario se puede usar los siguientes:
- APRO: Pago aprobado
- EXPI: La fecha de la tarjeta ha expirado
- FUND: Saldo insuficiente
- FORM: Rechazado a un error de formulario
- SECU: Rechazado por codigo de seguridad invalido
- CALL: Rechazado por validación para autorizar
- CONT: Pendiente de pago
- OTHE: Rechazado por error general 

```
[label Credit card]
Usuario comprador: TESTUSER1252018646
Contraseña comprador: lvBARbm7Pk

4915 1120 5524 6507
ccv: 123
expire: 11/25
Nombre de usuario: APRO / EXPI / FUND
C.C: 123456789

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