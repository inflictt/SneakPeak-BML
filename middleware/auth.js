const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');

// Middleware to check if user is authenticated via session
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'Please login to access this resource'
        });
    }
};

// Middleware to verify JWT token (alternative auth method)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Optional authentication - doesn't fail if not authenticated
const optionalAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        req.userId = req.session.userId;
    }
    next();
};

module.exports = {
    isAuthenticated,
    verifyToken,
    optionalAuth
};

