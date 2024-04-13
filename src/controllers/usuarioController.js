const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UsuarioService = require('../services/userServices');
const { schemaUser, schemaLogin, schemaForgot } = require('../models/schemas/schemaData');
const templateEmail = require('../../utils/templateMail')

const usuarioService = new UsuarioService();

async function createUser(req, res){
    try {

        //validate user
        const { error } = schemaUser.validate(req.body);

        if (error) {
            return res.status(400).json(
                {error: error.message}
            )
        }

        const { name,
            email,
            password,
            phone,
            role,
            street,
            apartment,
            zip,
            city,
            country } = req.body;
            
        const isEmailExists = await usuarioService.getIsEmailExists(req.body.email);
        if(isEmailExists){
            return res.status(400).json({
                error: 'Email ya registrado'
            })
        }

        let userData = {
            name: name,
            email: email,
            passwordHash: bcrypt.hashSync(password, 10),
            phone: phone,
            role: role,
            street: street,
            apartment: apartment,
            zip: zip,
            city: city,
            country: country
        };

        await usuarioService.registerUser(userData);
        res.status(201).json({
            message: 'Usuario registrado'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}

async function getUsers(req, res){
    try {
        const users = await usuarioService.getUser();
        res.status(200).json({
            users: users
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function getUser(req, res){
    try {
        const userId = req.params.id;
        const user = await usuarioService.getUserId(userId);
        res.status(200).json({
            user: user
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function getUserCount(req, res){
    try {
        const user = await usuarioService.getCount();
        res.status(200).json({
            count: user
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function getEmail(req, res){
    try {
       const user = await usuarioService.emailUser(req.body.email);
       res.status(200).json({
        user: user
       })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function login(req, res) {
    try {
        //validate user
        const { error } = schemaLogin.validate(req.body);

        if (error) {
            return res.status(400).json(
                {error: error.message}
            )
        }

        const user = await usuarioService.emailUser(req.body.email);
        const secret = process.env.SECRET;
        if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
            const token = jwt.sign({
                userId: user.id,
                role: user.role
            }, secret, { expiresIn: '1h'});
            res.status(200).header('authToken', token).json({
                user: user.name,
                userId: user.id,
                token: token
            });
        } else {
            res.status(400).json({
                error: 'Contraseña incorrecta'
            })
        }
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

async function register(req, res) {
    try {
        //validate user
        const { error } = schemaLogin.validate(req.body);

        if (error) {
            return res.status(400).json(
                {error: error.message}
            )
        }

        const { name,
            email,
            password,
            phone} = req.body;

        const isEmailExists = await usuarioService.getIsEmailExists(req.body.email);
        if(isEmailExists){
            return res.status(400).json({
                error: 'Email ya registrado'
            })
        }

        let userData = {
            name: name,
            email: email,
            passwordHash: bcrypt.hashSync(password, 10),
            phone: '0000000000'
        }

        const newUser = await usuarioService.registerUser(userData);
        res.status(201).json({
            message: 'Usuario registrado'
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

async function forgotPassword(req, res) {
    try {
        //validate user
        const { error } = schemaForgot.validate(req.body);

        if (error) {
            return res.status(400).json(
                {error: error.message}
            )
        }

        const secret = process.env.SECRET;
        const user = await usuarioService.emailUser(req.body.email);
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1d' });
        await user.updateOne({
            tokenResetPassword: token
        })        

        const emailPort = process.env.EMAIL_PORT || 3000;

        const transporter = nodemailer.createTransport({
            host: process.env.HOST_EMAIL,
            port: emailPort,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const uri = `${process.env.HOST_URL}api/v1/users`

        const email = {
            body: {
                name: `${user.name}`,
                intro: 'Has recibido un email de recuperación de contraseña',
                action: {
                    instructions: 'Click en el boton de abajo para cambiar su contraseña',
                    button: {
                        color: '#DC4D2F',
                        text: 'Cambiar contraseña',
                        link: `${uri}/resetpassword/${user.id}/${token}`
                    }
                },
                outro: 'Si tu no has solicitado ningun cambio de contraseña, omite esta información'
            }
        }

        const template = templateEmail.generate(email)

        const mailOptions = {
            from: 'ecommerceelflaco@gmail.com',
            to: `${user.email}`,
            subject: 'Enlace para recuperar su cuenta de Ecommerce',
            html: template
            //text: `${uri}/resetpassword/${user.id}/${token}`
        }

        transporter.sendMail(mailOptions, (err, response) => {
            if(err){
                console.error('Ha ocurrido un problema', err)
            } else {
                console.log('Respuesta', response);
                res.status(200).json({
                    message: 'El email para la recuperacion ha sido enviado'
                })
            }
        })

    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

async function resetPassword(req, res) {
    try {
        const pass = bcrypt.hashSync(req.body.password, 10);
        const userId = req.body.userId;
        const token = req.body.token;
        await usuarioService.updatePass(pass, userId, token);
        res.status(200).json({
            message: 'Contraseña cambiada'
        })
    } catch (error) {
        res.status(404).json({
            error: error.message
        })   
    }
}

async function updateUser(req, res) {
    try {
        const userId = req.params.id;

        //validate user
        const { error } = schemaUser.validate(req.body);


        if (error) {
            return res.status(400).json(
                {error: error.message}
            )
        }

        const {
            name, email, phone, roles,
            street, apartment, zip, city, country
        } = req.body;

        let userData = {
            name: name,
            email: email,
            phone: phone,
            roles: roles,
            street: street,
            apartment: apartment,
            zip: zip,
            city: city,
            country: country
        };

        const user = await usuarioService.updateUser(userId, userData);
        res.status(200).json({
            message: 'Usuario actualizado'
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        })   
    }
}

async function deleteUser(req, res){
    try {
        const userId = req.params.id;
        await usuarioService.deleteUser(userId);
        res.status(200).json({
            message: 'Usuario eliminado'
        })
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

module.exports = {
    createUser,
    getUsers,
    getUser,
    getUserCount,
    getEmail,
    login,
    register,
    forgotPassword,
    resetPassword,
    updateUser,
    deleteUser
}