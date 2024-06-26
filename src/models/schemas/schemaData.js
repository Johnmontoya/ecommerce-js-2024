const joi = require('joi');

const schemaUser = joi.object({
    name: joi.string().min(3).max(20).required()
        .messages({
            'string.min': `El nombre de usuario no debe ser inferior a 3 carácteres`,
            'string.max': `El nombre de usuario no debe ser superior a 20 carácteres`,
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `El nombre de usuario es requerido`
        }),
    email: joi.string().min(3).max(40).required().email()
        .messages({
            'string.min': `El email no debe ser inferior a 3 carácteres`,
            'string.max': `El email no debe ser superior a 40 carácteres`,
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `El email es requerido`,
            'string.email': `Dirección de correo invalida`
        }),
    password: joi.string().min(3)
        .messages({
            'string.min': `La contraseña no debe ser inferior a 3 carácteres`,
        }),
    phone: joi.string().required()
        .messages({
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `El número de telefono es requerido con extension`
        }),
    role: joi.string().allow(null, ''),
    zip: joi.string().allow(null, ''),
    street: joi.string().allow(null,''),
    apartment: joi.string().allow(null, ''),
    city: joi.string().allow(null, ''),
    country: joi.string().allow(null, '')
})

const schemaLogin = joi.object({
    name: joi.string().allow(null, '').messages({
        'string.min': `El nombre de usuario no debe ser inferior a 3 carácteres`,
        'string.max': `El nombre de usuario no debe ser superior a 20 carácteres`,
        'string.empty': `Este campo no puede estar vacio`,
        'any.required': `El nombre de usuario es requerido`
    }),
    email: joi.string().min(3).max(35).required().email()
        .messages({
            'string.min': `El email no debe ser inferior a 3 carácteres`,
            'string.max': `El email no debe ser superior a 35 carácteres`,
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `El email es requerido`,
            'string.email': `Dirección de correo invalida`
        }),
    password: joi.string().min(3).max(30).required()
        .messages({
            'string.min': `La contraseña no debe ser inferior a 3 carácteres`,
            'string.max': `La contraseña no debe ser superior a 30 carácteres`,
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `La contraseña es requerida`
        })
})

const schemaForgot = joi.object({
    email: joi.string().min(3).max(35).required().email()
        .messages({
            'string.min': `El email no debe ser inferior a 3 carácteres`,
            'string.max': `El email no debe ser superior a 35 carácteres`,
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `El email es requerido`,
            'string.email': `Dirección de correo invalida`
        })
})

const schemaCategory = joi.object({
    name: joi.string().required()
        .messages({
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `El nombre de categoria es requerido`
        }),
    icon: joi.string(),
    color: joi.string(),
})

const schemaProduct = joi.object({
    name: joi.string().required()
        .messages({
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `El nombre del producto es requerido`
        }),
    description: joi.string().min(20).max(150).required()
        .messages({
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `La descripción es requerida`,
            'string.min': `La descripción no debe ser inferior a 20 carácteres`,
            'string.max': `La descripción no debe ser superior a 150 carácteres`,
        }),
    richDescription: joi.string().min(30).max(600)
        .messages({
            'string.min': `La descripción no debe ser inferior a 30 carácteres`,
            'string.max': `La descripción no debe ser superior a 600 carácteres`,
        }),
    image: '',
    category: joi.string().required()
        .messages({
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `Una categoria es requerida`
        }),
    brand: joi.string(),
    price: joi.number()
        .messages({
            'number.base': `Debe ser un valor numerico`
        }),
    countInStock: joi.number().required()
        .messages({
            'number.base': `Debe ser un valor numerico`,
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `El stock es requerido`
        }),
    rating: joi.number()
        .messages({
            'number.base': `Debe ser un valor numerico`
        }),
    numReviews: joi.number()
        .messages({
            'number.base': `Debe ser un valor numerico`
        }),
    isFeatured: joi.boolean()

})

const schemaOrders = joi.object({
    orderItems: joi.array().items(
        joi.object({
            quantity: joi.number(),
            product: joi.string()
        })
    ),
    shippingAddress1: joi.string().required()
        .messages({
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `El stock es requerido`
        }),
    shippingAddress2: joi.string(),
    city: joi.string().required()
        .messages({
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `La ciudad es requerida`
        }),
    zip: joi.string().required()
        .messages({
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `El codigo postal es requerido`
        }),
    country: joi.string().required()
        .messages({
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `El pais es requerido`
        }),
    phone: joi.string().required()
        .messages({
            'string.empty': `Este campo no puede estar vacio`,
            'any.required': `Un número de celular es requerido`
        }),
    status: joi.string().required(),
    user: joi.string(),
})

module.exports = {
    schemaLogin,
    schemaUser,
    schemaForgot,
    schemaCategory,
    schemaProduct,
    schemaOrders
}