const CategoryService = require('../services/categoryServices');
const { schemaCategory } = require('../models/schemas/schemaData');

const categoryService = new CategoryService();

async function createCategory(req, res) {
    try {
        //validate category
        const { error } = schemaCategory.validate(req.body);

        if (error) {
            return res.status(400).json(
                {error: error.message}
            )
        }

        const categoryData = req.body;
        const newCategory = await categoryService.registerCategory(categoryData);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function getCategories(req, res){
    try {
        const categories = await categoryService.getCategories();
        res.status(200).json({categories: categories});
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function getCategory(req, res) {
    try {
        const categoryId = req.params.id;
        const category = await categoryService.getCategoryById(categoryId);
        res.json({category: category});
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function updateCategory(req, res){
    try {
        const categoryId = req.params.id;

        //validate category
        const { error } = schemaCategory.validate(req.body);

        if (error) {
            return res.status(400).json(
                {error: error.message}
            )
        }

        let categoryData = {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        }

        const category = await categoryService.updateCategory(categoryId, categoryData)
        res.status(200).json({category: category});
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function deleteCategory(req, res){
    try {
        const categoryId = req.params.id;        
        await categoryService.deleteCategory(categoryId);
        res.status(200).json({
            message: "Categoria eliminada"
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        })   
    }
}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
};