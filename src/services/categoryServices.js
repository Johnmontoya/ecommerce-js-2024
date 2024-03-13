const CategoryRepository = require('../repositories/categoryRepository');

class CategoryService {
    constructor(){
        this.categoryRepository = new CategoryRepository;
    }

    async registerCategory(categoryData) {
        try {
            const category = await this.categoryRepository.createCategory(categoryData);
            return category;
        } catch (error) {
            throw new Error('Error creando la categoria');
        }
    }

    async getCategories(){
        const categories = await this.categoryRepository.getCategories();
        return categories;
    }

    async getCategoryById(categoryId){
        const category = await this.categoryRepository.getCategoryById(categoryId);
        if(!category){
            throw new Error('Categoria no encontrada');
        }
        return category;
    }

    async updateCategory(categoryId, categoryData){        
        const category = await this.categoryRepository.putCategory(categoryId, categoryData);
        if(!category){
            throw new Error('Categoria no encontrada');
        }
        return category;
    }

    async deleteCategory(categoryId){        
        const category = await this.categoryRepository.deleteCategory(categoryId);
        if(!category){
            throw new Error('Categoria no encontrada');
        }
        return category;
    }
}

module.exports = CategoryService;