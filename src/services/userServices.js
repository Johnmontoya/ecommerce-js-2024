const UserRepository = require('../repositories/userRepository');

class UserService {
    constructor(){
        this.userRepository = new UserRepository;
    }

    async registerUser(userData){
        try {
            const user = await this.userRepository.createUser(userData);
            return user;
        } catch (error) {
            throw new Error('Error creando el usuario')
        }
    }

    async getUser(){
        const users = await this.userRepository.getUsers();
        return users;
    }

    async getUserId(userId){
        const user = await this.userRepository.getUserById(userId);
        if(!user){
            throw new Error('Usuario no encontrado');
        }
        return user;
    }

    async updateUser(userId, userData){
        const user = await this.userRepository.updateUser(userId, userData);
        if(!user){
            throw new Error('Usuario no encontrado');
        }
        return user;
    }

    async deleteUser(userId){
        const user = await this.userRepository.deleteUser(userId)
        if(!user){
            throw new Error('Usuario no encontrado');
        }
        return user;
    }
}

module.exports = UserService;