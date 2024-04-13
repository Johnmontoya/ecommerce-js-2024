const request = require('supertest');
const app = require('../../src/app');
const bcrypt = require('bcryptjs');
const factory = require('../../utils/factory/factory.fake');

require('dotenv').config();

const url = process.env.API_URL

let user;
let login;
beforeEach(async() => {

    user = await factory.create('user', {
        passwordHash: bcrypt.hashSync('pacoelflaco', 10),
        role: 'Admin'
    });

    login = await request(app)
        .post(`${url}/users/login`)
        .set('content-type', "application/json")
        .send({
            email: user.email,
            password: 'pacoelflaco'
    })
})

describe("Categorias Unit testing", () => {
    describe(`POST ${url}/categorias`, () => {
        it('Deberia validar si el campo de nombre esta vacio', async() => {
            try {
                const category = await request(app)
                    .post(`${url}/categorias`)
                    .set('content-type', 'application/json')
                    .set('Authorization', `Bearer ${login.body.token}`)
                    .send({
                        icon: 'dress',
                        color: '#445455'
                    });

                expect(category.statusCode).toBe(400);
                expect(category.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })
})