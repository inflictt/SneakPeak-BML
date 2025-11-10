const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { isAuthenticated } = require('../middleware/auth');

// All cart routes require authentication
router.use(isAuthenticated);

// Get cart
router.get('/', async (req, res) => {
    try {
        const cart = await Cart.getWithTotals(req.session.userId);
        
        res.json({
            success: true,
            cart
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cart'
        });
    }
});

// Add item to cart
router.post('/add', async (req, res) => {
    try {
        const { productId, name, brand, subtitle, price, size, vendor, image, quantity } = req.body;
        
        // Validation
        if (!productId || !name || !price || !size || !vendor) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        
        const cart = await Cart.addItem(req.session.userId, {
            productId,
            name,
            brand,
            subtitle,
            price,
            size,
            vendor,
            image,
            quantity: quantity || 1
        });
        
        const cartWithTotals = await Cart.getWithTotals(req.session.userId);
        
        res.json({
            success: true,
            message: 'Item added to cart',
            cart: cartWithTotals
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add item to cart'
        });
    }
});

// Update item quantity
router.put('/update/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        
        if (!quantity || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quantity'
            });
        }
        
        const cart = await Cart.updateItemQuantity(req.session.userId, itemId, quantity);
        const cartWithTotals = await Cart.getWithTotals(req.session.userId);
        
        res.json({
            success: true,
            message: 'Cart updated',
            cart: cartWithTotals
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update cart'
        });
    }
});

// Remove item from cart
router.delete('/remove/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;
        
        const cart = await Cart.removeItem(req.session.userId, itemId);
        const cartWithTotals = await Cart.getWithTotals(req.session.userId);
        
        res.json({
            success: true,
            message: 'Item removed from cart',
            cart: cartWithTotals
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove item'
        });
    }
});

// Clear cart
router.delete('/clear', async (req, res) => {
    try {
        const cart = await Cart.clear(req.session.userId);
        
        res.json({
            success: true,
            message: 'Cart cleared',
            cart
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear cart'
        });
    }
});

module.exports = router;

