const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/SneakPeak';
const client = new MongoClient(uri);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db();
        console.log('✅ MongoDB Connected Successfully');
        
        // Create indexes for better performance
        await createIndexes();
        
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

async function createIndexes() {
    try {
        // Users collection indexes
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('users').createIndex({ username: 1 }, { unique: true });
        
        // Products collection indexes
        await db.collection('products').createIndex({ id: 1 }, { unique: true });
        await db.collection('products').createIndex({ brand: 1 });
        
        // Cart collection indexes
        await db.collection('carts').createIndex({ userId: 1 });
        
        console.log('✅ Database indexes created');
    } catch (error) {
        console.error('⚠️  Index creation error:', error.message);
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
}

async function closeDB() {
    await client.close();
    console.log('MongoDB connection closed');
}

module.exports = { connectDB, getDB, closeDB };

