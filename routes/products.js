const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products with optional filters
router.get('/', async (req, res) => {
    try {
        const { brand, minPrice, maxPrice, search } = req.query;
        
        const products = await Product.findAll({
            brand,
            minPrice,
            maxPrice,
            search
        });
        
        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});

// Get featured/new arrivals
router.get('/featured', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const products = await Product.getFeatured(limit);
        
        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured products'
        });
    }
});

// Get products by brand
router.get('/brand/:brand', async (req, res) => {
    try {
        const { brand } = req.params;
        const products = await Product.findByBrand(brand);
        
        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get products by brand error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product'
        });
    }
});

module.exports = router;

