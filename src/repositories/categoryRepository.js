const { Category } = require('../models/category');

class CategoryRepository {
    async createCategory(categoryData){
        try {
            const newCategory = await Category.create(categoryData);
            return newCategory;
        } catch (error) {
            throw new Error('Error al crear la categoria: ' + error.message);
        }
    }

    async getCategories(){
        try {
            const categories = await Category.find();
            return categories;
        } catch (error) {
            throw new Error('Error al obtener las categorias: ' + error.message);
        }
    }

    async getCategoryById(categoryId){
        try {
            const category = await Category.findById(categoryId);
            return category;
        } catch (error) {
            throw new Error('Error al obtener la categoria: ' + error.message);
        }
    }

    async putCategory(categoryId, categoryData){
        try {
            const { name, icon, color } = categoryData
            const updateCategory = await Category.findByIdAndUpdate(categoryId, 
                {   name: name,
                    icon: icon,
                    color: color 
                },
                { new: true });
            return updateCategory;
        } catch (error) {
            throw new Error('Error al obtener la categoria: ' + error.message);
        }
    }

    async deleteCategory(categoryId){
        try {
            console.log("repo", categoryId);
            const category = await Category.findByIdAndDelete(categoryId);
            return category;
        } catch (error) {
            throw new Error('Error al obtener la categoria: ' + error.message);
        }
    }
}

module.exports = CategoryRepository;