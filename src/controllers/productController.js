const multer = require('multer');
const fs = require('fs');
const ProductService = require('../services/productServices');
const { default: mongoose } = require('mongoose');

const productServices = new ProductService();

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

async function createProduct(req, res){
    try {        

        uploadOptions.single('image')(req, res, async(err) => {
            if (err instanceof multer.MulterError) {
                // Maneja errores de Multer
                return res.status(400).json({ error: 'Error al cargar el archivo: ' + err.message });
            } else if (err) {
                // Maneja otros errores
                return res.status(500).json({ error: 'Error interno del servidor: ' + err.message });
            }

            const file = req.file;

            if(!file) return res.status(400).send('Una imagen es requerida');            
            
            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

            const productData = {
                ...req.body,
                image: `${basePath}${fileName}`
            };

            const newProduct = await productServices.registerProduct(productData);
            res.json(newProduct);
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getProducts(req, res){
    try {
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

        const products = await productServices.getProducts(filter, limit);
        res.json(products);
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function getProduct(req, res){
    try {
        const productId = req.params.id;
        const product = await productServices.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function updatedProduct(req, res){
    try {
        const productId = req.params.id;
        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).send('ID invalido')
        }

        uploadOptions.single('image')(req, res, async(err) => {
            if (err instanceof multer.MulterError) {
                // Maneja errores de Multer
                return res.status(400).json({ error: 'Error al cargar el archivo: ' + err.message });
            } else if (err) {
                // Maneja otros errores
                return res.status(500).json({ error: 'Error interno del servidor: ' + err.message });
            }

            const file = req.file;

            if(!file) return res.status(400).send('Una imagen es requerida');

            if(file) {
                const existingImage = await productServices.getProductById(productId);                
                
                if (existingImage.image && (existingImage.image !== null || existingImage.image !== undefined)) {
                    //Borra del string http://localhost:3000/
                    const location = existingImage.image.split(process.env.HOST_URL);
                
                    if (location.length > 1) {
                        fs.unlink(location[1], (err) => {
                            if (err) {
                                console.error('Error al eliminar la imagen anterior: ' + err);
                            }
                        });
                    }
                }
            }
            
            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

            const productData = {
                ...req.body,
                image: `${basePath}${fileName}`
            };

            const product = await productServices.updateProduct(productId, productData);
            res.json(product);
        })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteProduct(req, res){
    try {
        const productId = req.params.id;

        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).send('ID invalido')
        }

        const existingImage = await productServices.getProductById(productId);

        if(existingImage.images && existingImage.images.length > 0){
            existingImage.images.forEach(async(images) => {                
                const imagesLocation = images.split(process.env.HOST_URL);
                if(imagesLocation.length > 1){
                    fs.unlink(imagesLocation[1], (err) => {
                        if (err) {
                            console.error('Error al eliminar la imagen anterior: ' + err);
                        }
                    });
                }
            })
        }

        if (existingImage.image && (existingImage.image !== null || existingImage.image !== undefined)) {
            //Borra del string http://localhost:3000/
            const location = existingImage.image.split(process.env.HOST_URL);
                    
            if (location.length > 1) {
                fs.unlink(location[1], (err) => {
                    if (err) {
                        console.error('Error al eliminar la imagen anterior: ' + err);
                    }
                });
            }

            await productServices.deleteProduct(productId);
        }
        
        res.status(200).json({
            message: 'Producto eliminado'
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function getCountProduct(req, res) {
    try {
        const product = await productServices.getCount();
        res.json(product);
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function getFeaturedProduct(req, res) {
    try {
        const count = req.params.count ? req.params.count : 0;
        const product = await productServices.getFeatured(count);
        res.json(product);
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function updatedGalleryImages(req, res){
    try {
        const productId = req.params.id;
        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).send('ID invalido')
        }

        uploadOptions.array('images', 10)(req, res, async(err) => {
            const files = req.files;
            let imagePaths = [];
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

            if(files){
                files.map(file => {
                    imagePaths.push(`${basePath}${file.filename}`);
                })
            }

            const product = await productServices.updateGallery(productId, imagePaths);
            res.json(product);
        })
    } catch (error) {
        res.status(404).json({
            error: error.message
        }) 
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updatedProduct,
    deleteProduct,
    getCountProduct,
    getFeaturedProduct,
    updatedGalleryImages
}