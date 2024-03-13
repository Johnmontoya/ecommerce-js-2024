const ProductRepository = require('../repositories/productRepository');

class ProductService {
    constructor(){
        this.productRepository = new ProductRepository;
    }

    async registerProduct(productData) {
        try {            
            const product = await this.productRepository.createProduct(productData);
            return product;
        } catch (error) {
            throw new Error('Error al crear el producto'); 
        }
    }

    async getProducts(filter, limit){
        const products = await this.productRepository.getProducts(filter, limit);
        return products;
    }

    async getProductById(productId){
        const product = await this.productRepository.getProductById(productId);
        if(!product){
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async updateProduct(productId, productData){        
        const product = await this.productRepository.putProduct(productId, productData);
        if(!product){
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async deleteProduct(productId){
        const product = await this.productRepository.deleteProduct(productId);
        if(!product){
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async getCount(){
        const product = await this.productRepository.getCountProduct();
        return product;
    }

    async getFeatured(count){
        const product = await this.productRepository.getFeatured(count);
        return product;
    }

    async updateGallery(productId, productData){
        const product = await this.productRepository.putGalleryImages(productId, productData);
        if(!product){
            throw new Error('Producto no encontrado');
        }
        return product;
    }
}

module.exports = ProductService;