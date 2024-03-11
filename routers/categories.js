const { Category } = require('../models/category');
const express = require('express')
const router = express.Router()

router.get(`/`, async(req, res) => {
    const categoryList = await Category.find();

    if(!categoryList){
        res.status(500).json({
            success: false
        })
    }
    res.status(200).send(categoryList);
})

router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, icon, color } = req.body;

        if (!name || !icon || !color) {
            return res.status(400).json({ message: 'Name, icon, and color are required fields' });
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, icon, color },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found or cannot be updated' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, icon, color } = req.body;

        if (!name || !icon || !color) {
            return res.status(400).json({ message: 'Name, icon, and color are required fields' });
        }

        const category = new Category({ name, icon, color });

        const savedCategory = await category.save();

        if (!savedCategory) {
            throw new Error('Failed to create category');
        }

        res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', (req, res) => {
    Category.findOneAndDelete({ _id: req.params.id }).then(
        category => {
            if (category) {
                return res.status(200).json({
                    success: true,
                    message: 'The category has been deleted'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
        }
    ).catch(err => {
        return res.status(500).json({
            success: false,
            error: err
        });
    });
});



module.exports = router;