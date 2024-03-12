const bcrypt = require('bcryptjs');
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
        res.json(newUser)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function getUsers(req, res){
    try {
        const users = await usuarioService.getUser();
        res.json(users);
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function getUser(req, res){
    try {
        const userId = req.params.id;
        const user = await usuarioService.getUserId(userId);
        res.json(user);
    } catch (error) {
        res.status(404).json({
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
        res.json(user);
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
    updateUser,
    deleteUser
}