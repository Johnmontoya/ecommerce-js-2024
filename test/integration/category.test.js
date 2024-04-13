const request = require('supertest');
const app = require('../../src/app');
const factory = require('../../utils/factory/factory.fake');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const url = process.env.API_URL
let category;
let user;
let login;
beforeEach(async() => {
    category = await factory.createMany('category', 2);

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

describe("Categorias controller", () => {
    describe(`POST ${url}/categorias`, () => {
        it('Deberia almacenar en la base de datos la nueva categoria', async() => {
            try{
                const data = await factory.create('category');
                const response = await request(app)
                    .post(`${url}/categorias`)
                    .set('content-type', 'application/json')
                    .set('Authorization', `Bearer ${login.body.token}`)
                    .send({
                        name: data.name,
                        icon: data.icon,
                        color: data.color
                    });
                //console.log(data)
                expect(response.statusCode).toBe(201);

                //Eliminar el id, ya que se genera un valor automatico aleatorio en la base de datos
                const { _id, ...expectedBody } = response.body;

                expect(expectedBody).toEqual({
                    name: expectedBody.name,
                    icon: expectedBody.icon,
                    color: expectedBody.color,
                    "__v": 0
                });
            } catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`GET ${url}/categorias`, () => {
        it('Deberia retornar todas las categorias', async() => {
            try{
                const categories = await request(app)
                    .get(`${url}/categorias`)
                    .set("content-type", "application/json");
                expect(categories.statusCode).toBe(200);
                expect(categories.body).toHaveProperty("categories");
                expect(categories.body.categories.length).toBeGreaterThan(0);
            } catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }                     
        })
    })

    describe("GET ${url}/categorias/:id", () => {
        it('Deberia retornar una sola categoria por su ID', async() => {  
            try{          
                const categoria = await request(app)
                    .get(`${url}/categorias/${category[1].id}`)
                    .set('content-type', 'application/json')
                
                expect(categoria.statusCode).toBe(200);
                expect(categoria.body).toHaveProperty('category');

                //Eliminar el id, ya que se genera un valor automatico aleatorio en la base de datos
                const { _id, ...expectedBody } = categoria.body.category;

                //Verificar que los datos que se obtienen son los correctos
                expect(expectedBody).toEqual({
                    name: expectedBody.name,
                    icon: expectedBody.icon,
                    color: expectedBody.color,
                    "__v": 0
                })
            } catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 404 si la categoria con el ID no existe', async() => {
            try{
                const categoria = await request(app)
                    .get(`${url}/categorias/639c80ef98284bfdf111ad09`)
                    .set('content-type', 'application/json')
                
                //console.log(categoria.body);
                expect(categoria.statusCode).toBe(404);
                expect(categoria.body).toHaveProperty('error');
            }catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`PUT ${url}/categorias/:id`, () => {
        it('Deberia actualizar los datos de la categoria seleccionada por su ID', async() => {
            try{
                const data = await factory.create('category');
                const update = await request(app)
                    .put(`${url}/categorias/${category[0].id}`)
                    .set('Authorization', `Bearer ${login.body.token}`)
                    .send({
                        name: data.name,
                        icon: data.icon,
                        color: data.color
                    })
                    .set('content-type', 'application/json');
                expect(update.statusCode).toBe(200);

                //Eliminar el id, ya que se genera un valor automatico aleatorio en la base de datos
                const { _id, ...expectedBody } = update.body.category;

                expect(expectedBody).toEqual({
                    name: expectedBody.name,
                    icon: expectedBody.icon,
                    color: expectedBody.color,
                    "__v": 0
                })
            }catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 404 si la categoria con el ID no existe', async() => {
            try{
                const update = await request(app)
                    .put(`${url}/categorias/639c80ef98284bfdf111ad09}`)
                    .set('Authorization', `Bearer ${login.body.token}`)
                    .send({
                        name: "Home",
                        icon: "house",
                        color: "#443455"
                    })
                    .set('content-type', 'application/json')
                
                //console.log(categoria.body);
                expect(update.statusCode).toBe(404);
                expect(update.body).toHaveProperty('error');
            }catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`DELETE ${url}/categorias/:id`, () => {
        it('Deberia eliminar la categoria seleccionada por su ID', async() => {
            try{
                const categoria = await request(app)
                    .delete(`${url}/categorias/${category[1].id}`)
                    .set('content-type', 'application/json')
                    .set('Authorization', `Bearer ${login.body.token}`);
                        
                expect(categoria.statusCode).toBe(200);
                expect(categoria.body).toHaveProperty("message");
            }catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 404 si la categoria con el ID no existe', async() => {
            try{
                const update = await request(app)
                    .delete(`${url}/categorias/639c80ef98284bfdf111ad09}`)
                    .set('content-type', 'application/json')
                    .set('Authorization', `Bearer ${login.body.token}`);
                
                //console.log(categoria.body);
                expect(update.statusCode).toBe(404);
                expect(update.body).toHaveProperty('error');
            }catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })
})