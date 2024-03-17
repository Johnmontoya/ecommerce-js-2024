const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioService = require('../services/userServices');

const usuarioService = new UsuarioService();

async function createUser(req, res){
    try {
        const { name,
            email,
            password,
            phone,
            isAdmin,
            street,
            apartment,
            zip,
            city,
            country } = req.body;

        if(!name){
            return res.status(400).json({
                message: 'El nombre de usuario es requerido'
            })
        }

        if(!email){
            return res.status(400).json({
                message: 'El email de usuario es requerido'
            })
        }

        if(!password){
            return res.status(400).json({
                message: 'Una contraseña es requerida'
            })
        }

        if(!phone){
            return res.status(400).json({
                message: 'El teléfono de usuario es requerido'
            })
        }

        let userData = {
            name: name,
            email: email,
            passwordHash: bcrypt.hashSync(password, 10),
            phone: phone,
            isAdmin: isAdmin,
            street: street,
            apartment: apartment,
            zip: zip,
            city: city,
            country: country
        };

        const newUser = await usuarioService.registerUser(userData);
        res.status(201).json(newUser)
    } catch (error) {
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
        const user = await usuarioService.emailUser(req.body.email);
        const secret = process.env.SECRET;
        if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
            const token = jwt.sign({
                userId: user.id,
                isAdmin: user.isAdmin
            }, secret, { expiresIn: '1d'});
            res.status(200).header('authToken', token).json({
                user: user.email,
                token: token
            });
        } else {
            res.status(400).json({
                message: 'Contraseña incorrecta'
            })
        }
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const {
            name, email, password, phone, isAdmin,
            street, apartment, zip, city, country
        } = req.body;

        if(!name){
            return res.status(400).json({
                message: 'El nombre de usuario es requerido'
            })
        }

        if(!email){
            return res.status(400).json({
                message: 'El email de usuario es requerido'
            })
        }

        if(!password){
            return res.status(400).json({
                message: 'Una contraseña es requerida'
            })
        }

        if(!phone){
            return res.status(400).json({
                message: 'El teléfono de usuario es requerido'
            })
        }

        let userData = {
            name: name,
            email: email,
            password: bcrypt.hashSync(password, 10),
            phone: phone,
            isAdmin: isAdmin,
            street: street,
            apartment: apartment,
            zip: zip,
            city: city,
            country: country
        };

        const user = await usuarioService.updateUser(userId, userData);
        res.status(200).json({
            user: user
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
    updateUser,
    deleteUser
}