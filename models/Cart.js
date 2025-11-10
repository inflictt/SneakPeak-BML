const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class Cart {
    static collection() {
        return getDB().collection('carts');
    }
    
    // Get or create cart for user
    static async getOrCreate(userId) {
        let cart = await this.collection().findOne({ userId });
        
        if (!cart) {
            cart = {
                userId,
                items: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const result = await this.collection().insertOne(cart);
            cart._id = result.insertedId;
        }
        
        return cart;
    }
    
    // Add item to cart
    static async addItem(userId, item) {
        const { productId, name, brand, subtitle, price, size, vendor, image, quantity = 1 } = item;
        
        // Create unique item identifier based on product, size, and vendor
        const itemId = `${productId}_${size}_${vendor}`;
        
        const cart = await this.getOrCreate(userId);
        
        // Check if item already exists
        const existingItemIndex = cart.items.findIndex(i => i.id === itemId);
        
        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                id: itemId,
                productId,
                name,
                brand,
                subtitle,
                price,
                size,
                vendor,
                image,
                quantity,
                addedAt: new Date()
            });
        }
        
        const result = await this.collection().findOneAndUpdate(
            { userId },
            { 
                $set: { 
                    items: cart.items,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );
        
        return result.value;
    }
    
    // Update item quantity
    static async updateItemQuantity(userId, itemId, quantity) {
        if (quantity <= 0) {
            return await this.removeItem(userId, itemId);
        }
        
        const result = await this.collection().findOneAndUpdate(
            { userId, 'items.id': itemId },
            { 
                $set: { 
                    'items.$.quantity': quantity,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );
        
        return result.value;
    }
    
    // Remove item from cart
    static async removeItem(userId, itemId) {
        const result = await this.collection().findOneAndUpdate(
            { userId },
            { 
                $pull: { items: { id: itemId } },
                $set: { updatedAt: new Date() }
            },
            { returnDocument: 'after' }
        );
        
        return result.value;
    }
    
    // Clear cart
    static async clear(userId) {
        const result = await this.collection().findOneAndUpdate(
            { userId },
            { 
                $set: { 
                    items: [],
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );
        
        return result.value;
    }
    
    // Get cart with calculated totals
    static async getWithTotals(userId) {
        const cart = await this.getOrCreate(userId);
        
        const subtotal = cart.items.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );
        
        return {
            ...cart,
            subtotal,
            itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
        };
    }
}

module.exports = Cart;

