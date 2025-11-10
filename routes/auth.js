const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, username, firstName, lastName, phoneNumber } = req.body;
        
        // Validation
        if (!email || !password || !username || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }
        
        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }
        
        // Create user
        const user = await User.create({
            email,
            password,
            username,
            firstName,
            lastName,
            phoneNumber
        });
        
        // Create session
        req.session.userId = user._id.toString();
        req.session.email = user.email;
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: User.sanitizeUser(user),
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }
        
        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Verify password
        const isValidPassword = await User.verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Create session
        req.session.userId = user._id.toString();
        req.session.email = user.email;
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            message: 'Login successful',
            user: User.sanitizeUser(user),
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Logout user
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        
        res.json({
            success: true,
            message: 'Logout successful'
        });
    });
});

// Get current user
router.get('/me', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            user: User.sanitizeUser(user)
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user data'
        });
    }
});

// Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber } = req.body;
        
        const updatedUser = await User.update(req.session.userId, {
            firstName,
            lastName,
            phoneNumber
        });
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: User.sanitizeUser(updatedUser)
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

// Check authentication status
router.get('/status', (req, res) => {
    res.json({
        success: true,
        isAuthenticated: !!req.session.userId,
        userId: req.session.userId || null
    });
});

module.exports = router;

