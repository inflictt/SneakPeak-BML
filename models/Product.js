const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class Product {
    static collection() {
        return getDB().collection('products');
    }
    
    // Create or update a product
    static async upsert(productData) {
        const updateData = { ...productData, updatedAt: new Date() };
        
        // Only set createdAt if it doesn't exist (for new products)
        const existing = await this.collection().findOne({ id: productData.id });
        if (!existing) {
            updateData.createdAt = new Date();
        }
        
        const result = await this.collection().findOneAndUpdate(
            { id: productData.id },
            { $set: updateData },
            { upsert: true, returnDocument: 'after' }
        );
        return result.value;
    }
    
    // Get all products
    static async findAll(filters = {}) {
        const query = {};
        
        // Add filters
        if (filters.brand) {
            query.brand = new RegExp(filters.brand, 'i');
        }
        if (filters.minPrice) {
            query.price = { ...query.price, $gte: parseFloat(filters.minPrice) };
        }
        if (filters.maxPrice) {
            query.price = { ...query.price, $lte: parseFloat(filters.maxPrice) };
        }
        if (filters.search) {
            query.$or = [
                { name: new RegExp(filters.search, 'i') },
                { brand: new RegExp(filters.search, 'i') },
                { subtitle: new RegExp(filters.search, 'i') }
            ];
        }
        
        return await this.collection().find(query).toArray();
    }
    
    // Get product by ID
    static async findById(id) {
        return await this.collection().findOne({ id: parseInt(id) });
    }
    
    // Get product by MongoDB _id
    static async findByMongoId(mongoId) {
        return await this.collection().findOne({ _id: new ObjectId(mongoId) });
    }
    
    // Get products by brand
    static async findByBrand(brand) {
        return await this.collection()
            .find({ brand: new RegExp(brand, 'i') })
            .toArray();
    }
    
    // Get featured/new arrivals
    static async getFeatured(limit = 10) {
        return await this.collection()
            .find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
    }
    
    // Bulk insert products (for seeding)
    static async bulkInsert(products) {
        const operations = products.map(product => ({
            updateOne: {
                filter: { id: product.id },
                update: { 
                    $set: { 
                        ...product, 
                        updatedAt: new Date(),
                        createdAt: new Date() // Add createdAt for sorting
                    } 
                },
                upsert: true
            }
        }));
        
        return await this.collection().bulkWrite(operations);
    }
}

module.exports = Product;

