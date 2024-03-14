const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserRepository {
    async createUser(userData){
        try {
            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            throw new Error('Error al crear el usuario: ' + error.message);
        }
    }

    async getUsers(){
        try {
            const users = await User.find().select('-passwordHash');
            return users;
        } catch (error) {
            throw new Error('Error al obtener a los usuarios: ' + error.message);
        }
    }

    async getUserById(userId){
        try {
            const user = await User.findById(userId).select('-passwordHash');
            return user;
        } catch (error) {
            throw new Error('Error al obtener el usuario: ' + error.message);
        }
    }

    async getCountUsers(){
        try {
            const userDocuments = await User.countDocuments();
            return userDocuments;
        } catch (error) {
            throw new Error('Error al obtener el número total de usuarios: ' + error.message);
        }
    }

    async loginEmail(emailUser){
        try {
            const user = await User.findOne({ email: emailUser})
            return user;
        } catch (error) {
            throw new Error('Error al obtener la información del usuario: ' + error.message);
        }
    }

    async updateUser(userId, userData){
        try {
            const {
                name, email, password, phone, isAdmin,
                street, apartment, zip, city, country
            } = userData;

            const updateUser = await User.findByIdAndUpdate(userId, {
                name: name,
                email: email,
                passwordHash: password,
                phone: phone,
                isAdmin: isAdmin,
                street: street,
                apartment: apartment,
                zip: zip,
                city: city,
                country: country
            },
            { new: true});
            return updateUser; 
        } catch (error) {
            throw new Error('Error al obtener el usuario: ' + error.message);
        }
    }

    async deleteUser(userId){
        try {
            const user = await User.findByIdAndDelete(userId);
            return user;
        } catch (error) {
            throw new Error('Error al obtener el usuario: ' + error.message);   
        }
    }
}

module.exports = UserRepository;