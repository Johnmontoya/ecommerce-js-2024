const request = require('supertest');
const app = require('../../app');

describe('API', () => {
    it('new category', async() => {
        const res = await request(app)
            .post('/api/v1/categories')
            .send({
                name: 'Test',
                icon: 'testing',
                color: '#444400'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual('Test')
    })
})