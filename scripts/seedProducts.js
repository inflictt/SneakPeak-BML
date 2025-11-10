const fs = require('fs');
const path = require('path');
const { connectDB, closeDB } = require('../config/db');
const Product = require('../models/Product');

async function seedProducts() {
    try {
        console.log('🌱 Starting product seeding...');
        
        // Connect to database
        await connectDB();
        
        // Read products from JSON file
        const productsPath = path.join(__dirname, '../data/products.json');
        const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        
        // Insert products
        const result = await Product.bulkInsert(productsData.products);
        
        console.log(`✅ Successfully seeded ${result.upsertedCount} new products`);
        console.log(`✅ Updated ${result.modifiedCount} existing products`);
        
        await closeDB();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}

seedProducts();

