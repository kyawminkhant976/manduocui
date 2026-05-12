# Burmese Jade Atelier - Backend

This is the backend API for the Burmese Jade Atelier website.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGODB_URI in .env if needed

3. Create admin user:
   ```bash
   npm run dev
   ```
   Then make a POST request to `/api/auth/register` with:
   ```json
   {
     "username": "admin",
     "email": "admin@example.com",
     "password": "yourpassword"
   }
   ```

4. Start the server:
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npm run dev
   ```

## API Endpoints

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (admin only)
- PUT /api/products/:id - Update product (admin only)
- DELETE /api/products/:id - Delete product (admin only)

### Authentication
- POST /api/auth/login - Login
- POST /api/auth/register - Register admin user

## Frontend Integration

Update your JavaScript files to use API calls instead of localStorage:

```javascript
// Instead of localStorage
const products = JSON.parse(localStorage.getItem('products')) || [];

// Use API
const response = await fetch('/api/products');
const products = await response.json();
```

## Next Steps

1. Add contact form handling
2. Implement image upload for products
3. Add order management
4. Set up payment processing
5. Add user authentication for customers