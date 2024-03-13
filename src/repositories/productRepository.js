const { Product } = require('../models/product');

class ProductRepository {
    async createProduct(productData){
        try {
            const newProduct = await Product.create(productData);
            return newProduct;
        } catch (error) {
            throw new Error('Error al crear el producto: ' + error.message);
        }
    }

    async getProducts(filter, limit){
        try {
            const products = await Product.find(filter).limit(limit).populate('category');
            return products;
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }

    async getProductById(productId){
        try {
            const product = await Product.findById(productId).populate('category');;
            return product;
        } catch (error) {
            throw new Error('Error al obtener el product: ' + error.message);
        }
    }

    async putProduct(productId, productData){
        try {            
            const updateProduct = await Product.findByIdAndUpdate(productId, 
            {
                name: productData.name,
                image: productData.image,
                countInStock: productData.countInStock,
                category: productData.category,
                description: productData.description,
                brand: productData.brand,
                richDescription: productData.richDescription,
                rating: productData.rating,
                isFeatured: productData.isFeatured,
                numReviews: productData.numReviews,
                price: productData.price
            }, { new: true })
            return updateProduct;
        } catch (error) {
            throw new Error('Error al actualizar el producto: ' + error.message);
        }
    }

    async deleteProduct(productId){
        try {
            const product = await Product.findByIdAndDelete(productId);
            return product;
        } catch (error) {
            throw new Error('Error al eliminar el producto: ' + error.message);
        }
    }

    async getCountProduct(){
        try {
            const product = await Product.countDocuments();
            return product;
        } catch (error) {
            throw new Error('Error al obtener el total de productos: ' + error.message);
        }
    }

    async getFeatured(count){
        try {
            const product = await Product.find({
                isFeatured: true
            }).limit(+count);
            return product;
        } catch (error) {
            throw new Error('Error al obtener el total de productos destacados: ' + error.message);
        }
    }

    async putGalleryImages(productId, productData){
        try {
            const updatedProduct = await Product.findByIdAndUpdate(productId, {
                images: productData
            }, {
                new: true
            });
            return updatedProduct;
        } catch (error) {
            throw new Error('Error al subir las imagenes: ' + error.message);
        }
    }
}

module.exports = ProductRepository;