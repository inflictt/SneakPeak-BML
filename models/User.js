const { getDB } = require('../config/db');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

class User {
    static collection() {
        return getDB().collection('users');
    }
    
    // Create a new user
    static async create(userData) {
        const { email, password, username, firstName, lastName, phoneNumber } = userData;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = {
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber: phoneNumber || null,
            createdAt: new Date(),
            updatedAt: new Date(),
            isVerified: false,
            role: 'user'
        };
        
        const result = await this.collection().insertOne(user);
        return { ...user, _id: result.insertedId };
    }
    
    // Find user by email
    static async findByEmail(email) {
        return await this.collection().findOne({ email: email.toLowerCase() });
    }
    
    // Find user by username
    static async findByUsername(username) {
        return await this.collection().findOne({ username: username.toLowerCase() });
    }
    
    // Find user by ID
    static async findById(id) {
        return await this.collection().findOne({ _id: new ObjectId(id) });
    }
    
    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
    
    // Update user
    static async update(id, updateData) {
        const { password, ...otherData } = updateData;
        
        // If password is being updated, hash it
        if (password) {
            otherData.password = await bcrypt.hash(password, 10);
        }
        
        otherData.updatedAt = new Date();
        
        const result = await this.collection().findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: otherData },
            { returnDocument: 'after' }
        );
        
        return result.value;
    }
    
    // Remove password from user object
    static sanitizeUser(user) {
        if (!user) return null;
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}

module.exports = User;

