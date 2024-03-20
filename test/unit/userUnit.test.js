const request = require('supertest');
const app = require('../../src/app');
const bcrypt = require('bcryptjs');
const factory = require('../../utils/factory/factory.fake');

require('dotenv').config();

const url = process.env.API_URL

describe("Usuario Unit testing", () => {
    describe(`POST ${url}/users`, () => {
        it('Deberia validar si el nombre de usuario es inferior a 3 carácteres', async() => {
            try {
                const data = await request(app)
                    .post(`${url}/users`)
                    .set('content-type', 'application/json')
                    .send({
                        name: 'Cj'
                    });
                //console.log(data.body)
                expect(data.statusCode).toBe(400);
                expect(data.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia validar si el nombre de usuario es superior a 20 carácteres', async() => {
            try {
                const data = await request(app)
                    .post(`${url}/users`)
                    .set('content-type', 'application/json')
                    .send({
                        name: 'Luis Alberto Gomez Bolañoz'
                    });
                //console.log(data.body)
                expect(data.statusCode).toBe(400);
                expect(data.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia validar si el campo de nombre de usuario esta vacio', async() => {
            try {
                const data = await request(app)
                    .post(`${url}/users`)
                    .set('content-type', 'application/json')
                    .send({
                        name: ''
                    });
                //console.log(data.body)
                expect(data.statusCode).toBe(400);
                expect(data.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia validar si el campo de email esta vacio', async() => {
            try {
                const data = await request(app)
                    .post(`${url}/users`)
                    .set('content-type', 'application/json')
                    .send({
                        name: 'John Doe',
                        email: ''
                    });
                //console.log(data.body)
                expect(data.statusCode).toBe(400);
                expect(data.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia validar si la direccion de email es valida', async() => {
            try {
                const data = await request(app)
                    .post(`${url}/users`)
                    .set('content-type', 'application/json')
                    .send({
                        name: 'John Doe',
                        email: 'johndoegmail.com'
                    });
                //console.log(data.body)
                expect(data.statusCode).toBe(400);
                expect(data.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia validar si el campo de contraseña esta vacio', async() => {
            try {
                const data = await request(app)
                    .post(`${url}/users`)
                    .set('content-type', 'application/json')
                    .send({
                        name: 'John Doe',
                        email: 'johndoe@gmail.com',
                        password: ''
                    });
                //console.log(data.body)
                expect(data.statusCode).toBe(400);
                expect(data.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia validar si la contraseña se esta encryptando antes de guardar', async() => {
            try {
                const data = await request(app)
                    .post(`${url}/users`)
                    .set('content-type', 'application/json')
                    .send({
                        name: 'John Doe',
                        email: 'johndoe@gmail.com',
                        password: 'pacoelflaco',
                        phone: '+5731431234350',
                        isAdmin: true,
                        zip: '190243',
                        street: 'Kra 13',
                        apartment: 'Hotel Casino',
                        city: 'Bogota',
                        country: 'Colombia'
                    });
                //console.log(data.body)

                const compareHahs = bcrypt.compareSync("pacoelflaco", data.body.newUser.passwordHash)
                expect(compareHahs).toBe(true);
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia validar si el campo de teléfono esta vacio', async() => {
            try {
                const data = await request(app)
                    .post(`${url}/users`)
                    .set('content-type', 'application/json')
                    .send({
                        name: 'John Doe',
                        email: 'johndoe@gmail.com',
                        password: 'pacoelflaco',
                        phone: ''
                    });
                //console.log(data.body)
                expect(data.statusCode).toBe(400);
                expect(data.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`POST ${url}/users/login`, () => {
        it('Deberia validar si el correo no existe en la base de datos', async() => {
            try {
                const data = await request(app)
                    .post(`${url}/users/login`)
                    .set('content-type', 'application/json')
                    .send({
                        email: 'pacoelflaco@gmail.com',
                        password: 'pacoelflaco'
                    });
                //console.log(data.body)
                expect(data.statusCode).toBe(400);
                expect(data.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia validar si la contraseña es incorrecta', async() => {
            try {
                const user = await factory.create('user', {
                    passwordHash: bcrypt.hashSync('pacoelflaco', 10)
                });

                const data = await request(app)
                    .post(`${url}/users/login`)
                    .set('content-type', 'application/json')
                    .send({
                        email: user.email,
                        password: 'pacoelflacox'
                    });
                //console.log(data.body)
                expect(data.statusCode).toBe(400);
                expect(data.body).toHaveProperty('message');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia validar si se esta creando un header con nombre authToken', async() => {
            try{
                const data = await factory.create('user', {
                    passwordHash: bcrypt.hashSync('pacoelflaco', 10)
                });

                //Una extension ya que faker no esta generando aleatorios
                const newEmail = 'x' + data.email;

                const user = await request(app)
                    .post(`${url}/users`)
                    .set('content-type', "application/json")
                    .send({
                        name: data.name,
                        email: newEmail.toString(), 
                        password: data.passwordHash,
                        phone: data.phone,
                        isAdmin: true,
                        street: data.street,
                        apartment: data.apartment,
                        zip: data.zip,
                        city: data.city,
                        country: data.country
                    });
                
                expect(user.statusCode).toBe(201);
                expect(user.header['authToken']).toBeDefined;
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })
})