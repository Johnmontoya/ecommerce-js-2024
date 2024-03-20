const request = require('supertest');
const app = require('../../src/app');

require('dotenv').config();

const url = process.env.API_URL

describe("Categorias Unit testing", () => {
    describe(`POST ${url}/categorias`, () => {
        it('Deberia validar si el campo de nombre esta vacio', async() => {
            try {
                const category = await request(app)
                    .post(`${url}/categorias`)
                    .set('content-type', 'application/json')
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