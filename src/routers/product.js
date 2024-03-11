const express = require('express')
const router = express.Router()
const {Product} = require('../models/product');
const { Category } = require('../models/category');
const mongoose = require('mongoose')
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type')

        if(isValid){
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ storage: storage })

router.get('/', async (req, res) => {
    try {
        //http://localhost:3000/api/v1/products?categories=5f15d5b2cb4a6642bddc0fe7,5f15d5b2cb4a6642bddc0234
        let filter = {};
        if (req.query.categories) {
            const categoryIds = req.query.categories.split(',');
            filter.category = { $in: categoryIds };
        }

        let limit = 10; // Valor predeterminado para el límite

        // Verificar si se proporciona un límite en la consulta (query)
        if (req.query.limit && !isNaN(parseInt(req.query.limit))) {
            limit = parseInt(req.query.limit);
        }

        // Si el límite no está en la consulta, verificar en el cuerpo de la solicitud (req.body)
        if (!limit && req.body.limit && !isNaN(parseInt(req.body.limit))) {
            limit = parseInt(req.body.limit);
        }

        const productList = await Product.find(filter).limit(limit).populate('category');

        if (!productList || productList.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found' });
        }

        res.status(200).json(productList);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.get(`/:id`, async (req, res) => {
    try {
        const productList = await Product.findById(req.params.id)
            .populate('category');

        if (!productList) {
            return res.status(404).json({
                success: false,
                message: "No se encontró ningún producto con el ID proporcionado."
            });
        }
        
        res.send(productList);
    } catch (error) {
        console.error("Error al buscar el producto:", error);
        res.status(500).json({
            success: false,
            message: "Ocurrió un error al buscar el producto. Por favor, inténtelo de nuevo más tarde."
        });
    }
});

router.post(`/`, uploadOptions.single('image'), async(req, res) => {
    const category = await Category.findById(req.body.category)
    
    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if(!category) return res.status(400).send('Invalid Category')
    
    let newProduct = new Product({
        name: req.body.name,
        image: `${basePath}${fileName}`,
        countInStock: req.body.countInStock,
        category: req.body.category,
        description: req.body.description,
        brand: req.body.brand,
        richDescription: req.body.richDescription,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        numReviews: req.body.numReviews,
        price: req.body.price
    })

    newProduct = await newProduct.save()

    if(!newProduct){
        return res.status(500).send('The product cannot be created')
    }

    res.send(newProduct)
})

router.put('/:id', uploadOptions.single('image'), async(req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id')
    }

    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid Category')

    const product = await Product.findById(req.params.id);
    if(!product) return res.status(400).send('INvalid product')

    const file = req.file;
    let imagepath;

    if(file){
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`
    } else {
        imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        image: imagepath,
        countInStock: req.body.countInStock,
        category: req.body.category,
        description: req.body.description,
        brand: req.body.brand,
        richDescription: req.body.richDescription,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        numReviews: req.body.numReviews,
        price: req.body.price
    }, {
        new: true
    })

    if(!updatedProduct){
        return res.status(500).send('the product cannot be updated')
    }

    res.send(updatedProduct)
})

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(
        product => {
            if(product){
                return res.status(200).json({
                    success: true,
                    message: ' the product is deleted'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'product not found'
                })
            }
        }
    ).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})

router.get('/get/count', async (req, res) => {
    try {
        const productCount = await Product.countDocuments();

        if (!productCount) {
            return res.status(500).json({
                success: false
            });
        }

        res.send({
            productCount: productCount
        });
    } catch (error) {
        console.error("Error al obtener el conteo de productos:", error);
        res.status(500).json({
            success: false,
            message: "Ocurrió un error al obtener el conteo de productos. Por favor, inténtelo de nuevo más tarde."
        });
    }
});

router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ?  req.params.count : 0

    const products = await Product.find({
        isFeatured: true
    }).limit(+count);

    if (!products) {
        return res.status(500).json({
            success: false
        });
    }

    res.send({
        products: products
    });
});

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async(req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id')
    }

    const files = req.files;
    let imagePaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;

    if(files){
        files.map(file => {
            imagePaths.push(`${basePath}${file.filename}`);
        })
    }
        
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        images: imagePaths
    }, {
        new: true
    })

    if(!updatedProduct){
        return res.status(500).send('the product cannot be updated')
    }

    res.send(updatedProduct)
})

module.exports = router;