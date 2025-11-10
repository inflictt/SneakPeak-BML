const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Look for EJS files in views directory

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname)));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/SneakPeak',
        touchAfter: 24 * 3600 // lazy session update (24 hours)
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Page routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'SneakPeak - Discover Authentic Sneakers',
        page: 'home'
    });
});

app.get('/login', (req, res) => {
    res.render('login', { 
        title: 'Log In - SneakPeak',
        page: 'login'
    });
});

app.get('/signup', (req, res) => {
    res.render('signup', { 
        title: 'Create Account - SneakPeak',
        page: 'signup'
    });
});

app.get('/cart', (req, res) => {
    res.render('cart', { 
        title: 'Shopping Cart - SneakPeak',
        page: 'cart'
    });
});

app.get('/discover', (req, res) => {
    res.render('discover', { 
        title: 'Discover - SneakPeak',
        page: 'discover'
    });
});

app.get('/about', (req, res) => {
    res.render('about', { 
        title: 'About Us - SneakPeak',
        page: 'about'
    });
});

app.get('/productDetails', (req, res) => {
    const productId = req.query.id;
    if (!productId) {
        return res.status(400).render('index', { 
            title: 'Product Not Found - SneakPeak',
            page: 'error'
        });
    }
    res.render('productDetails', { 
        title: 'Product Details - SneakPeak',
        page: 'productDetails',
        productId: productId
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'SneakPeak API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// 404 handler - but allow HTML files to pass through
app.use('*', (req, res) => {
    // If requesting an API route, return JSON error
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({
            success: false,
            message: 'API route not found'
        });
    }
    // Otherwise return 404 page or redirect to home
    res.status(404).render('index', { 
        title: '404 - Page Not Found',
        page: '404'
    });
});

// Start server
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    const { closeDB } = require('./config/db');
    await closeDB();
    process.exit(0);
});

