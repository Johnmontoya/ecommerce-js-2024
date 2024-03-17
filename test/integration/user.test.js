const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../src/app');
const { User } = require('../../src/models/user');

require('dotenv').config();

const url = process.env.API_URL
let user;
beforeEach(async() => {    
    user = await User.create({
        name: "John Doe Travolta",
        email: "JohnDoe@gmail.com",
        passwordHash: bcrypt.hashSync('pacoelflaco', 10),
        phone: "+573043625637",
        isAdmin: true,
        street: "Kra 9 #13A",
        apartment: "Room 32 hotel StarCity",
        zip: "190531",
        city: "New york",
        country: "Mexico"
    },{
        name: "Arnold Stallone",
        email: "Arnold@gmail.com",
        passwordHash: bcrypt.hashSync('terminator', 10),
        phone: "+573123625637",
        isAdmin: true,
        street: "Kra 10 #13A",
        apartment: "Room 27 hotel StarCity",
        zip: "190531",
        city: "New york",
        country: "Australia"
    });
});


describe("Users controller", () => {
    describe(`POST ${url}/users`, () => {
        it('Deberia crear un nuevo usuario y retornar  code http: 201', async() => {
            try{
                const user = await request(app)
                    .post(`${url}/users`)
                    .set('content-type', "application/json")
                    .send({
                        name: "John Doe Travolta",
                        email: "JohnDoe@hotmail.com",
                        password: "pacoelflaco",
                        phone: "+573043625637",
                        isAdmin: true,
                        street: "Kra 9 #13A",
                        apartment: "Room 32 hotel StarCity",
                        zip: "190531",
                        city: "New york",
                        country: "Mexico"
                    });
                expect(user.statusCode).toBe(201);
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`GET ${url}/users`, () => {
        it('Deberia retornar todos los usuarios y con code http: 200', async() => {
            try {
                const users = await request(app)
                    .get(`${url}/users`)
                    .set("content-type", "application/json");
                expect(users.statusCode).toBe(200);
                expect(users.body).toHaveProperty('users');
                expect(users.body.users.length).toBeGreaterThan(0);
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`GET ${url}/users/:id`, () => {
        it('Deberia retornar un usuario por su ID y con code http: 200', async() => {
            try {
                const response = await request(app)
                    .get(`${url}/users/${user[0].id}`)
                    .set('content-type', 'application/json');
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('user');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 404 si el usuario con el ID no existe', async() => {
            try{
                const response = await request(app)
                    .get(`${url}/users/639c80ef98284bfdf111ad09}`)
                    .set('content-type', 'application/json')
                
                //console.log(categoria.body);
                expect(response.statusCode).toBe(404);
                expect(response.body).toHaveProperty('error');
            } catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`GET ${url}/users/get/count`, () => {
        it('Deberia retornar el número total de usuarios registrados y con code http: 200', async() => {
            try {
                const response = await request(app)
                    .get(`${url}/users/get/count`)
                    .set('content-type', 'application/json');
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('count');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`PUT ${url}/users/:id`, () => {
        it('Deberia actualizar los datos del usuario y retornar el code http: 200', async() => {
            try {
                const response = await request(app)
                    .put(`${url}/users/${user[0].id}`)
                    .set('content-type', 'application/json')
                    .send({
                        name: 'John Travolta',
                        email: 'johntravolta@gmail.com',
                        password: "pacoelflaco",
                        phone: "+573043625637",
                        isAdmin: true,
                        street: "Kra 9 #13A",
                        apartment: "Room 32 hotel StarCity",
                        zip: "190531",
                        city: "New york",
                        country: "Mexico"
                    });
                
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('user');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 404 si el usuario con el ID no existe', async() => {
            try{
                const update = await request(app)
                .put(`${url}/users/639c80ef98284bfdf111ad09}`)
                .set('content-type', 'application/json')
                .send({
                    name: 'John Travolta',
                    email: 'johntravolta@gmail.com',
                    password: "pacoelflaco",
                    phone: "+573043625637",
                    isAdmin: true,
                    street: "Kra 9 #13A",
                    apartment: "Room 32 hotel StarCity",
                    zip: "190531",
                    city: "New york",
                    country: "Mexico"
                });
            
                //console.log(categoria.body);
                expect(update.statusCode).toBe(404);
                expect(update.body).toHaveProperty('error');
            } catch(error) {
                console.error('Error en la prueba:', error);
                throw error;
            }            
        })
    })

    describe(`POST ${url}/users/login`, () => {
        beforeEach(async() => {    
            user = await User.create({
                name: "Alejandro Magno",
                email: "magno@gmail.com",
                passwordHash: bcrypt.hashSync('pacoelflaco', 10),
                phone: "+573243625637",
                isAdmin: true,
                street: "Kra 12 #13A",
                apartment: "Room 33 hotel StarCity",
                zip: "192531",
                city: "Chicago",
                country: "China"
            })
        })

        it('Deberia el usuario poder loguear con sus credenciales y retornar un token', async() => {
            try {
                const login = await request(app)
                    .post(`${url}/users/login`)
                    .set('content-type', 'application/json')
                    .send({
                        email: 'magno@gmail.com',
                        password: 'pacoelflaco'
                    });

                //console.log(login.body);
                expect(login.status).toBe(200);
                expect(login.headers).toHaveProperty('authtoken');
                expect(login.body.token).toBeTruthy(); // Verifica si el token está presente en la respuesta                
                
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })        
    })

    describe(`DELETE ${url}/users/:id`, () => {
        it('Deberia eliminar el usuario y retornar el code http: 200', async() => {
            try {
                const response = await request(app)
                    .delete(`${url}/users/${user[1].id}`)
                    .set('content-type', 'application/json');
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('message');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 404 si el usuario con el ID no existe', async() => {
            try{
                const response = await request(app)
                .delete(`${url}/users/639c80ef98284bfdf111ad09}`)
                .set('content-type', 'application/json')
            
                //console.log(categoria.body);
                expect(response.statusCode).toBe(404);
                expect(response.body).toHaveProperty('error');
            } catch(error) {
                console.error('Error en la prueba:', error);
                throw error;
            }            
        })
    })
})