# FreshMart

A MERN grocery store with three kinds of users: customers who shop, an admin who manages the store, and suppliers who list their own products once the admin approves them.

## Features

**Customers**
- Browse products, filter by category, search by name/description and sort by price or newest
- Product detail pages with star ratings and reviews (one review per customer per product)
- Cart saved in the browser, checkout, order confirmation and order history on the profile page
- Register / log in with JWT auth

**Admin**
- Admin dashboard (`/admin/dashboard`) with a Suppliers tab to approve or reject supplier accounts
- Admin-only API endpoints to create, update and delete products with image upload (jpeg/jpg/png/webp, up to 5 MB), list all orders and update order status. The dashboard's Products and Orders tabs are still placeholders.

**Suppliers**
- Separate register / login pages (`/supplier/register`, `/supplier/login`)
- Can log in only after an admin approves the account
- Supplier dashboard to add products and see the products they have listed

## Tech stack

- **Frontend:** React 19, Vite, React Router, Tailwind CSS 4, Axios, react-hot-toast, lucide-react
- **Backend:** Node.js, Express 5, MongoDB with Mongoose, JWT, bcryptjs, Multer

## Project structure

```
backend/    Express API (routes, controllers, models, middleware, uploads/)
frontend/   React + Vite client
```

## Running locally

Prerequisites: Node.js 18+ and a MongoDB database (local or Atlas).

1. **Backend**

   ```bash
   cd backend
   npm install
   ```

   Create `backend/.env` (it is gitignored):

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/freshmart
   JWT_SECRET=change-me
   PORT=5000
   ```

   Create the first admin account (prints its login details), then start the API:

   ```bash
   node seed.js
   npm start          # http://localhost:5000
   ```

2. **Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev        # http://localhost:5173
   ```

   The client calls the API at `http://localhost:5000/api` (see `frontend/src/services/api.js`), and the Vite dev server proxies `/uploads` to the backend for product images.

## API overview

| Area | Routes |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile` |
| Products | `GET /api/products`, `GET /api/products/categories`, `GET /api/products/category/:category`, `GET /api/products/:id`; admin: `POST`, `PUT /:id`, `DELETE /:id` |
| Orders | `POST /api/orders`, `GET /api/orders/myorders`, `GET /api/orders/:id`; admin: `GET /api/orders`, `PUT /api/orders/:id/status` |
| Reviews | `GET /api/reviews/:productId`, `POST /api/reviews` |
| Suppliers | `POST /api/supplier/register`, `POST /api/supplier/login`; supplier: `GET`/`POST /api/supplier/products` |
| Admin | `GET /api/admin/suppliers`, `PUT /api/admin/suppliers/:id/status` |
