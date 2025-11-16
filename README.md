# SneakPeak-Bml – Full-Stack Sneaker Marketplace

SneakPeak is a full-stack e-commerce application built with Node.js, Express, and MongoDB. The platform connects sneaker enthusiasts with verified local vendors, allowing users to compare prices, sizes, and sellers in one place.

## Features

  * **User Authentication:** Secure user registration and login functionality, with password hashing using `bcryptjs` and persistent sessions using `express-session` and `connect-mongo`.
  * **Dynamic Product Catalog:** Products are loaded dynamically from the MongoDB database and rendered using EJS templates. Includes a working search bar.
  * **Multi-Vendor Product Details:** Users can view detailed product pages, select a size, and see a list of all available verified vendors and their respective prices for that size.
  * **Persistent Shopping Cart:** Full CRUD (Create, Read, Update, Delete) functionality for the shopping cart. The cart is stored in MongoDB and tied directly to the user's account.
  * **Responsive Frontend:** A clean, modern, and responsive UI built with EJS, CSS, and interactive client-side JavaScript.

## Tech Stack

  * **Frontend:** `EJS` (Template Engine), `CSS`, `JavaScript`
  * **Backend:** `Node.js`, `Express.js`
  * **Database:** `MongoDB`, `connect-mongo` (for session storage)
  * **Authentication:** `express-session`, `bcryptjs`
  * **Tools:** `Nodemon`, `Git`, `GitHub`

## Project Structure

```
SneakPeak-Bml/
├── config/
│   └── db.js                 # MongoDB connection logic
├── data/
│   └── products.json         # Product data for seeding
├── middleware/
│   └── auth.js               # Authentication middleware
├── models/
│   ├── Cart.js               # Cart Mongoose-like model
│   ├── Product.js            # Product Mongoose-like model
│   └── User.js               # User Mongoose-like model
├── routes/
│   ├── auth.js               # Authentication API routes
│   ├── cart.js               # Cart API routes
│   └── products.js           # Product API routes
├── scripts/
│   └── seedProducts.js       # Script to seed database
├── views/
│   ├── partials/
│   │   ├── _footer.ejs
│   │   └── _header.ejs
│   ├── about.ejs
│   ├── cart.ejs
│   ├── discover.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── productDetails.ejs
│   └── signup.ejs
├── css/                      # All frontend CSS files
├── js/                       # All frontend JavaScript files
├── server.js                 # Main Express server file
├── package.json
├── .gitignore
└── README.md
```

## How to Run the Project

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/SneakPeak-Bml.git
    cd SneakPeak-Bml
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Create `.env` file**
    Create a `.env` file in the root directory and add your environment variables:

    ```env
    MONGODB_URI=mongodb://localhost:27017/SneakPeak
    SESSION_SECRET=your_super_secret_session_key
    JWT_SECRET=your_super_secret_jwt_key
    ```

4.  **Start MongoDB**
    Ensure your local MongoDB service is running.

5.  **Seed the Database**
    Run the seed script to populate your database with products from `data/products.json`:

    ```bash
    npm run seed
    ```

6.  **Start the server**
    Start the server using Nodemon (as required by the project).

    ```bash
    npm run dev
    ```

    The server will run at: `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in an existing user |
| `POST` | `/api/auth/logout` | Log out the current user |
| `GET` | `/api/auth/status` | Check if a user is authenticated |

### Products

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Get all products (supports filters) |
| `GET` | `/api/products/featured` | Get featured products |
| `GET` | `/api/products/:id` | Get a single product by its ID |

### Cart (Requires Authentication)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/cart` | Get the current user's cart |
| `POST` | `/api/cart/add` | Add an item to the cart |
| `PUT` | `/api/cart/update/:itemId` | Update the quantity of an item |
| `DELETE` | `/api/cart/remove/:itemId` | Remove an item from the cart |
| `DELETE` | `/api/cart/clear` | Clear all items from the cart |

## Future Improvements

  * Implement Wishlist functionality
  * Integrate a payment gateway (e.g., Stripe)
  * Add a user profile page to view order history
  * Create a seller-side dashboard for vendors to manage their listings

## Contributors

  * Saksham Lodha
  * Prerit Shrivastava
  * Rishit Rebant
