const CategoryService = require('../services/categoryServices');

const categoryService = new CategoryService();

async function createCategory(req, res) {
    try {
        const categoryData = req.body;
        const newCategory = await categoryService.registerCategory(categoryData);
        res.json(newCategory);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function getCategories(req, res){
    try {
        const categories = await categoryService.getCategories();
        res.json(categories);
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function getCategory(req, res) {
    try {
        const categoryId = req.params.id;
        const category = await categoryService.getCaregoryById(categoryId);
        res.json(category);
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

async function updateCategory(req, res){
    try {
        const categoryId = req.params.id;
        const { name, icon, color } = req.body;

        if (!name || !icon || !color) {
            return res.status(400).json({ message: 'Name, icon, and color are required fields' });
        }

        let categoryData = {
            name: name,
            icon: icon,
            color: color
        }

        const category = await categoryService.updateCategory(categoryId, categoryData)
        res.json(category);
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