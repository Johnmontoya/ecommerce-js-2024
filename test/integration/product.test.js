const request = require('supertest');
const app = require('../../src/app');
const path = require('path');
const { Product } = require('../../src/models/product');
const factory = require('../../utils/factory/factory.fake');

require('dotenv').config();

const url = process.env.API_URL
let product;
beforeEach(async() => {
  product = await factory.createMany('product', 2)
})

describe("Productos controller", () => {
    describe(`POST ${url}/products`, () => {
        it('Deberia almacenar en la base de datos el nuevo producto y devolver code 200', async () => {
            try {
                const imagePath = path.resolve(__dirname, '../../public/images/logo.jpg'); // Ajusta la ruta de la imagen
                const data = await factory.create('product');                

                //convertimos la funcion resultado a string
                let convertFn = data.category.toString();

                const response = await request(app)
                    .post(`${url}/products`)
                    .attach('image', imagePath)
                    .field('name', data.name)
                    .field('description', data.description)
                    .field('richDescription', data.richDescription)
                    .field('brand', data.brand)
                    .field('category', convertFn)
                    .field('price', data.price)
                    .field('countInStock', data.countInStock)
                    .field('rating', data.rating)
                    .field('numReviews', data.numReviews)
                    .field('isFeatured', true);
    
                console.log(data)
                expect(response.statusCode).toBe(201);
    
                // Eliminar el id, ya que se genera automáticamente en la base de datos
                const { _id, dateCreated, image, images, ...expectedBody } = response.body;
    
                expect(expectedBody).toEqual({
                    name: expectedBody.name,
                    description: expectedBody.description,
                    richDescription: expectedBody.richDescription,
                    brand: expectedBody.brand,
                    category: expectedBody.category,
                    price: expectedBody.price,
                    countInStock: expectedBody.countInStock,
                    rating: expectedBody.rating,
                    numReviews: expectedBody.numReviews,
                    isFeatured: true,
                    __v: 0
                });
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        });
    });

    describe(`GET ${url}/products`, () => {
        it('Deberia retornar todos los productos y devolver code 200', async() => {
            try {
                const products = await request(app)
                    .get(`${url}/products`)
                    .set('content-type', 'application/json');
                expect(products.statusCode).toBe(200);
                expect(products.body).toHaveProperty('products');
                expect(products.body.products.length).toBeGreaterThan(0);
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`GET ${url}/products/:id`, () => {
        it('Deberia retornar un producto por su ID y devolver code 200', async() => {
            try {
                const products = await request(app)
                .get(`${url}/products/${product[0].id}`)
                .set("content-type", "application/json");
            
                //console.log(products)
                expect(products.statusCode).toBe(200);
                expect(products.body).toHaveProperty('product');

                //Eliminar el id, ya que se genera un valor automatico aleatorio en la base de datos
                const { _id, dateCreated, image, images, ...expectedBody } = products.body.product;

                //Verificar que los datos que se obtienen son los correctos
                expect(expectedBody).toEqual({
                    name: expectedBody.name,
                    description: expectedBody.description,
                    richDescription: expectedBody.richDescription,
                    brand: expectedBody.brand,
                    category: expectedBody.category,
                    price: expectedBody.price,
                    countInStock: expectedBody.countInStock,
                    rating: expectedBody.rating,
                    numReviews: expectedBody.numReviews,
                    isFeatured: true,
                    __v: 0
                })
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 404 si el producto con el ID no existe', async() => {
            try{
                const producto = await request(app)
                    .get(`${url}/products/639c80ef98284bfdf111ad09`)
                    .set('content-type', 'application/json')
                
                //console.log(categoria.body);
                expect(producto.statusCode).toBe(404);
                expect(producto.body).toHaveProperty('error');
            }catch(error){
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`$PUT ${url}/products/:id`, () => {
        it('Deberia actualizar los datos seleccionados por su ID', async() => {
            try {
                const imagePath = path.resolve(__dirname, '../../public/images/logo.jpg'); // Ajusta la ruta de la imagen
                const data = await factory.create('product');                

                //convertimos la funcion resultado a string
                let convertFn = data.category.toString();

                const update = await request(app)
                    .put(`${url}/products/${product[0].id}`)
                    .attach('image', imagePath)
                    .field('name', data.name)
                    .field('description', data.description)
                    .field('richDescription', data.richDescription)
                    .field('brand', data.brand)
                    .field('category', convertFn)
                    .field('price', data.price)
                    .field('countInStock', data.countInStock)
                    .field('rating', data.rating)
                    .field('numReviews', data.numReviews)
                    .field('isFeatured', true);

                //console.log(response.body)
                expect(update.statusCode).toBe(200);
    
                // Eliminar el id, ya que se genera automáticamente en la base de datos
                const { _id, dateCreated, image, images, ...expectedBody } = update.body;
    
                expect(expectedBody).toEqual({
                    name: expectedBody.name,
                    description: expectedBody.description,
                    richDescription: expectedBody.richDescription,
                    brand: expectedBody.brand,
                    category: expectedBody.category,
                    price: expectedBody.price,
                    countInStock: expectedBody.countInStock,
                    rating: expectedBody.rating,
                    numReviews: expectedBody.numReviews,
                    isFeatured: true,
                    __v: 0
                });
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 400 si el ID del producto no existe', async() => {
            try {
                const update = await request(app)
                    .put(`${url}/products/639c80ef98284bfdf111ad09}`)
                expect(update.statusCode).toBe(400);
                expect(update.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 400 si una imagen no es cargada', async() => {
            try {
                const data = await factory.create('product');                

                //convertimos la funcion resultado a string
                let convertFn = data.category.toString();

                const updateImage = await request(app)
                    .put(`${url}/products/${product[0].id}`)
                    .attach('image', '')
                    .field('name', data.name)
                    .field('description', data.description)
                    .field('richDescription', data.richDescription)
                    .field('brand', data.brand)
                    .field('category', convertFn)
                    .field('price', data.price)
                    .field('countInStock', data.countInStock)
                    .field('rating', data.rating)
                    .field('numReviews', data.numReviews)
                    .field('isFeatured', true);
                
                expect(updateImage.statusCode).toBe(400);
                expect(updateImage.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`DELETE ${url}/products:id`, () => {
        it('Deberia eliminar el producto y retornar code 200', async() => {
            const response = await request(app)
                .delete(`${url}/products/${product[1].id}`)
                .set('content-type', 'application/json');
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message');
        })

        it('Deberia retornar 400 si el ID del producto no existe', async() => {
            try {
                const response = await request(app)
                    .delete(`${url}/products/639c80ef98284bfdf111ad09}`)
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`GET ${url}/products/get/featured/:count`, () => {
        it('Deberia retornar los productos destacados', async() => {
            try {
                const count = true;
                const response = await request(app)
                    .get(`${url}/products/get/featured/${count}`)
                    .set('content-type', 'application/json');
                
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('product');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar los productos no destacados', async() => {
            try {
                const count = false;
                const response = await request(app)
                    .get(`${url}/products/get/featured/${count}`)
                    .set('content-type', 'application/json');
                
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('product');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`GET ${url}/products/get/count`, () => {
        it('Deberia retornar el total de productos guardados en la base de datos', async() => {
            try {
                const response = await request(app)
                    .get(`${url}/products/get/count`)
                    .set('content-type', 'application/json');
                
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('product');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })

    describe(`PUT ${url}/products/gallery-images/:id`, () => {
        it('Deberia subir varias imagenes en el producto seleccionado por su ID', async() => {
            try {
                const imagePath = [
                    path.resolve(__dirname, '../../public/images/logo.jpg'),
                    path.resolve(__dirname, '../../public/images/logo.jpg')
                ]; // Ajusta la ruta de la imagen

                const response = await request(app)
                    .put(`${url}/products/gallery-images/${product[0].id}`)
                    .attach('images', imagePath[0])
                    .attach('images', imagePath[1]);
                
                //console.log(response.body)
                expect(response.statusCode).toBe(200);
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })

        it('Deberia retornar 400 si el ID del producto no existe', async() => {
            try {
                const response = await request(app)
                    .put(`${url}/products/gallery-images/639c80ef98284bfdf111ad09}`)
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('error');
            } catch (error) {
                console.error('Error en la prueba:', error);
                throw error;
            }
        })
    })
})