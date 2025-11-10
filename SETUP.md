# SneakPeak MongoDB Integration - Setup Guide

This guide will help you set up the MongoDB backend for the SneakPeak sneaker marketplace.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** (optional) - For version control

## Installation Steps

### 1. Install MongoDB

If you haven't installed MongoDB yet:

**Windows:**
- Download MongoDB Community Server from the official website
- Run the installer and follow the installation wizard
- MongoDB will start automatically as a Windows service
- Default connection string: `mongodb://localhost:27017/`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Verify MongoDB is Running

Open a terminal/command prompt and run:
```bash
mongosh
```

If MongoDB is running, you should see the MongoDB shell. Type `exit` to close it.

### 3. Install Node.js Dependencies

Navigate to your project root directory and install dependencies:

```bash
npm install
```

This will install all required packages:
- express - Web framework
- mongodb - MongoDB driver
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - Cross-origin resource sharing
- dotenv - Environment variables
- express-session - Session management
- connect-mongo - MongoDB session store

### 4. Configure Environment Variables

Create a `.env` file in the project root (it's already set to be ignored by git):

```env
MONGODB_URI=mongodb://localhost:27017/SneakPeak
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_this
SESSION_SECRET=your_super_secret_session_key_change_this
NODE_ENV=development
```

**Important:** Change the JWT_SECRET and SESSION_SECRET to random, secure strings in production.

### 5. Seed the Database with Products

Before starting the server, seed your database with the initial product data:

```bash
npm run seed
```

This will import all products from `data/products.json` into your MongoDB database.

### 6. Start the Backend Server

Start the Node.js/Express backend server:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
✅ Database indexes created
🚀 Server running on http://localhost:3000
📡 API endpoints available at http://localhost:3000/api
```

### 7. Start the Frontend

Open the frontend in a browser. You can use:

**Option 1: Live Server (VS Code Extension)**
- Install "Live Server" extension in VS Code
- Right-click on `index.html` and select "Open with Live Server"

**Option 2: Python Simple HTTP Server**
```bash
# Python 3
python -m http.server 5500

# Python 2
python -m SimpleHTTPServer 5500
```

**Option 3: Node.js http-server**
```bash
npx http-server -p 5500
```

The frontend should now be accessible at `http://localhost:5500` or `http://127.0.0.1:5500`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/status` - Check authentication status
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/brand/:brand` - Get products by brand

### Cart (Requires Authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

## Testing the Integration

### 1. Test User Registration
1. Open `http://localhost:5500/signup.html`
2. Fill in the registration form
3. Submit - you should be redirected to the homepage

### 2. Test Login
1. Open `http://localhost:5500/login.html`
2. Enter your credentials
3. Submit - you should be logged in

### 3. Test Adding to Cart
1. Navigate to a product details page
2. Select a size and vendor
3. Click "Add to Cart"
4. You should see a success message
5. Navigate to the cart page to see your item

### 4. Test Cart Management
1. On the cart page, try:
   - Increasing/decreasing quantity
   - Removing items
   - Viewing updated totals

## Database Structure

### Collections

**users**
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  username: String (unique, indexed),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phoneNumber: String,
  createdAt: Date,
  updatedAt: Date,
  isVerified: Boolean,
  role: String
}
```

**products**
```javascript
{
  _id: ObjectId,
  id: Number (unique, indexed),
  brand: String (indexed),
  name: String,
  subtitle: String,
  price: Number,
  originalPrice: Number,
  images: [String],
  sizes: [Number],
  vendors: [{
    name: String,
    price: Number,
    rating: Number,
    verified: Boolean
  }],
  details: Object,
  description: String,
  updatedAt: Date
}
```

**carts**
```javascript
{
  _id: ObjectId,
  userId: String (indexed),
  items: [{
    id: String,
    productId: Number,
    name: String,
    brand: String,
    subtitle: String,
    price: Number,
    size: Number,
    vendor: String,
    image: String,
    quantity: Number,
    addedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: connect ECONNREFUSED"**
- Ensure MongoDB is running: `sudo systemctl status mongod` (Linux) or check Services (Windows)
- Check if MongoDB is listening on port 27017
- Try connecting with mongosh: `mongosh mongodb://localhost:27017`

### CORS Issues

**Error: "Access to fetch blocked by CORS policy"**
- Ensure the backend server is running
- Check that your frontend URL is in the CORS whitelist in `server.js`
- Default allowed origins: `http://localhost:5500`, `http://127.0.0.1:5500`

### Session Issues

**Error: "Please login to access this resource"**
- Clear your browser cookies
- Ensure you're logged in
- Check that SESSION_SECRET is set in .env
- Verify that credentials: 'include' is set in API requests

### Port Already in Use

**Error: "EADDRINUSE: address already in use :::3000"**
```bash
# Find and kill the process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

## Development Tools

### MongoDB Compass
Download [MongoDB Compass](https://www.mongodb.com/products/compass) for a GUI to explore your database.

Connection string: `mongodb://localhost:27017`

### Postman
Use [Postman](https://www.postman.com/) to test API endpoints directly.

### MongoDB Shell Commands

```bash
# Connect to database
mongosh mongodb://localhost:27017/SneakPeak

# View all collections
show collections

# View users
db.users.find()

# View products
db.products.find()

# View carts
db.carts.find()

# Count documents
db.users.countDocuments()
db.products.countDocuments()

# Drop a collection (careful!)
db.carts.drop()
```

## Security Notes

⚠️ **Important for Production:**

1. **Change default secrets** - Update JWT_SECRET and SESSION_SECRET in .env
2. **Use environment variables** - Never commit .env to version control
3. **Enable HTTPS** - Use secure cookies in production
4. **Add rate limiting** - Prevent brute force attacks
5. **Validate input** - Add proper input validation and sanitization
6. **Use MongoDB Atlas** - Consider using MongoDB Atlas for production instead of local MongoDB

## Next Steps

- Implement password reset functionality
- Add email verification
- Implement order management
- Add product reviews and ratings
- Implement search functionality
- Add admin dashboard
- Deploy to production (Heroku, AWS, DigitalOcean, etc.)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check MongoDB and Node.js logs
4. Ensure all dependencies are properly installed

## License

This project is for educational purposes.

