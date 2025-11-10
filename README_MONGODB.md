# SneakPeak - MongoDB Integration Complete! 🎉

This document provides a quick overview of the MongoDB integration for the SneakPeak project.

## What's Been Implemented

### Backend (Node.js + Express + MongoDB)

#### ✅ Server Setup
- Express.js server with CORS and session management
- MongoDB connection with proper error handling
- Environment configuration with dotenv
- Session storage using MongoDB (connect-mongo)

#### ✅ Authentication System
- User registration with password hashing (bcryptjs)
- Login with JWT token generation
- Session-based authentication
- Logout functionality
- User profile management
- Authentication status checking

#### ✅ Database Models
- **User Model** - User management with bcrypt password hashing
- **Product Model** - Product CRUD operations with filtering
- **Cart Model** - Shopping cart management per user

#### ✅ API Routes

**Authentication Routes** (`/api/auth`)
- `POST /register` - Create new user account
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user details
- `GET /status` - Check if user is authenticated
- `PUT /profile` - Update user profile

**Product Routes** (`/api/products`)
- `GET /` - Get all products (with filters: brand, price range, search)
- `GET /featured` - Get featured/new products
- `GET /brand/:brand` - Get products by brand
- `GET /:id` - Get single product details

**Cart Routes** (`/api/cart`) - *Requires Authentication*
- `GET /` - Get user's cart with totals
- `POST /add` - Add item to cart
- `PUT /update/:itemId` - Update item quantity
- `DELETE /remove/:itemId` - Remove item from cart
- `DELETE /clear` - Clear entire cart

#### ✅ Middleware
- Authentication middleware (session-based)
- JWT verification middleware (alternative)
- Optional authentication middleware

#### ✅ Database Seeding
- Script to import products from JSON to MongoDB
- Bulk upsert operations for efficiency

### Frontend Updates

#### ✅ API Utility (`js/api.js`)
- Centralized API client with fetch wrapper
- All authentication methods
- All product methods
- All cart methods
- Proper error handling
- Credentials included for session cookies

#### ✅ Updated JavaScript Files

**signup.js**
- Integrated with `/api/auth/register` endpoint
- Auto-generates username from email
- Redirects to homepage after successful registration
- Proper error handling and user feedback

**login.js**
- Integrated with `/api/auth/login` endpoint
- Session-based authentication
- Redirects to homepage after successful login
- Error handling for invalid credentials

**cart.js**
- Loads cart from MongoDB instead of localStorage
- Authentication check before loading cart
- API calls for add, update, remove operations
- Real-time cart updates
- Login prompt for unauthenticated users

**productDetails.js**
- Authentication check before adding to cart
- API call to add items to cart
- Redirects to login if not authenticated
- Success/error message handling

#### ✅ Updated HTML Files
All relevant HTML files now include the `api.js` script:
- `index.html`
- `login.html`
- `signup.html`
- `cart.html`
- `productDetails.html`

## File Structure

```
SneakPeak-BML/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── middleware/
│   └── auth.js                  # Authentication middleware
├── models/
│   ├── User.js                  # User model and methods
│   ├── Product.js               # Product model and methods
│   └── Cart.js                  # Cart model and methods
├── routes/
│   ├── auth.js                  # Authentication routes
│   ├── products.js              # Product routes
│   └── cart.js                  # Cart routes
├── scripts/
│   └── seedProducts.js          # Database seeding script
├── js/
│   ├── api.js                   # NEW: Frontend API client
│   ├── signup.js                # UPDATED: Uses MongoDB API
│   ├── login.js                 # UPDATED: Uses MongoDB API
│   ├── cart.js                  # UPDATED: Uses MongoDB API
│   └── productDetails.js        # UPDATED: Uses MongoDB API
├── server.js                    # Main server file
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables (create this)
├── .gitignore                   # Git ignore file
├── SETUP.md                     # Detailed setup instructions
└── README_MONGODB.md            # This file
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the project root:
```env
MONGODB_URI=mongodb://localhost:27017/SneakPeak
PORT=3000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
SESSION_SECRET=your_session_secret_change_this_in_production
NODE_ENV=development
```

### 3. Ensure MongoDB is Running
```bash
# Check if MongoDB is running
mongosh
```

### 4. Seed the Database
```bash
npm run seed
```

### 5. Start the Backend Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

### 6. Open the Frontend
Open `index.html` with Live Server or any HTTP server on port 5500.

## Key Features

### 🔐 Secure Authentication
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for stateless authentication
- Session-based authentication for web
- Protected routes requiring authentication

### 🛒 Persistent Cart
- Cart data stored in MongoDB per user
- Survives browser refresh and logout/login
- Real-time quantity updates
- No more localStorage limitations

### 👤 User Management
- User registration and login
- Profile information storage
- Role-based access (extendable)
- Email and username uniqueness

### 📦 Product Management
- Products stored in MongoDB
- Filtering by brand, price, search
- Featured products
- Multi-vendor support per product

### 🔄 Session Management
- Sessions stored in MongoDB
- Automatic session refresh
- 7-day session expiration
- Secure cookie configuration

## Testing Flow

### Complete User Journey:

1. **Register** → `http://localhost:5500/signup.html`
   - Enter email and password
   - Auto-generates username
   - Creates user in MongoDB
   - Auto-login after registration

2. **Login** → `http://localhost:5500/login.html`
   - Enter credentials
   - Session created in MongoDB
   - Redirected to homepage

3. **Browse Products** → `http://localhost:5500/index.html`
   - View product listings
   - Click on product to see details

4. **Add to Cart** → `http://localhost:5500/productDetails.html`
   - Select size and vendor
   - Add to cart (requires authentication)
   - Item saved to MongoDB

5. **View Cart** → `http://localhost:5500/cart.html`
   - See all cart items from MongoDB
   - Update quantities
   - Remove items
   - View totals

6. **Logout** → API call
   - Session destroyed
   - Cart persists for next login

## Benefits of MongoDB Integration

### Before (localStorage):
- ❌ Cart lost on browser clear
- ❌ No user accounts
- ❌ No security
- ❌ Limited storage
- ❌ Single device only

### After (MongoDB):
- ✅ Persistent cart across devices
- ✅ User accounts with authentication
- ✅ Secure password storage
- ✅ Unlimited storage
- ✅ Multi-device synchronization
- ✅ API-based architecture
- ✅ Scalable backend

## Production Considerations

Before deploying to production:

1. **Security**
   - Change JWT_SECRET and SESSION_SECRET
   - Enable HTTPS
   - Set secure cookie flags
   - Add rate limiting
   - Implement input validation

2. **Database**
   - Use MongoDB Atlas (cloud)
   - Enable authentication
   - Set up backups
   - Configure indexes

3. **Server**
   - Use PM2 or similar for process management
   - Set up logging
   - Configure monitoring
   - Set NODE_ENV=production

4. **CORS**
   - Update allowed origins to your production domain
   - Remove development URLs

## API Examples

### Register User
```javascript
const response = await API.register({
    email: "user@example.com",
    password: "SecurePass123",
    username: "johndoe",
    firstName: "John",
    lastName: "Doe"
});
```

### Login
```javascript
const response = await API.login({
    email: "user@example.com",
    password: "SecurePass123"
});
```

### Add to Cart
```javascript
const response = await API.addToCart({
    productId: 1,
    name: "Puma Palermo",
    brand: "Puma",
    price: 5249,
    size: 9,
    vendor: "SoleTrade Mumbai",
    image: "assets/images/img_palermo_side.png",
    quantity: 1
});
```

### Get Cart
```javascript
const response = await API.getCart();
console.log(response.cart.items);
console.log(response.cart.subtotal);
```

## Troubleshooting

See [SETUP.md](./SETUP.md) for detailed troubleshooting guide.

## What's Next?

Potential enhancements:
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Order management
- [ ] Product reviews
- [ ] Wishlist functionality
- [ ] Admin dashboard
- [ ] Payment integration
- [ ] Real-time notifications
- [ ] Social authentication (Google, Apple)

## Congratulations! 🎊

Your SneakPeak application now has a fully functional MongoDB backend with user authentication and persistent cart management!

For detailed setup instructions, see [SETUP.md](./SETUP.md).

