# Simple Product Management System

CSE-223 Database Management System — Project (Fahim Muntasir Sadi, Towhidul Islam)

A full-stack product/inventory manager with a login page and colorful dashboard, built to match the Project Proposal PDF:
- **Backend:** Node.js + Express
- **Frontend:** HTML, CSS, JavaScript
- **Database:** MySQL
- **Products table:** `id`, `name`, `price`, `quantity` (as specified in the proposal)

## 1. Set up the database (using XAMPP / phpMyAdmin)

1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin`.
3. Click the **SQL** tab, paste the contents of `schema.sql`, and click **Go**.
   - This creates the `product_management_db` database, the `products` table, the `users` table, and 4 sample products.

## 2. Configure the project

1. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Open `.env` and set your MySQL credentials (XAMPP default is user `root` with an empty password, so the defaults usually work as-is).

## 3. Install dependencies & run

```bash
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

## 4. Log in

The server automatically creates a default account the first time it starts:

- **Username:** `admin`
- **Password:** `admin123`

## Features

- Login page with session-based authentication (passwords hashed with bcrypt)
- Colorful dashboard with live stats: total products, units in stock, inventory value, low-stock count
- Full CRUD: add, view, search, edit, and delete products
- Stock-status badges (In stock / Low stock / Out of stock)
- All product routes are protected — you must be logged in to use the API

## Project structure

```
product-management-system/
├── server.js              # Express app entry point
├── config/db.js           # MySQL connection pool
├── routes/auth.js         # Login / logout / session API
├── routes/products.js     # Product CRUD API (protected)
├── public/
│   ├── login.html / .css / .js     # Login page
│   └── index.html / style.css / script.js   # Dashboard
├── schema.sql              # Database schema + sample data
├── .env.example
└── package.json
```

## For your presentation

This matches the architecture described in the proposal:
- **Frontend** (HTML/CSS/JS) → **Backend** (Node.js/Express) → **Database** (MySQL)
- Workflow: user inputs product data → backend processes the request → database stores/updates it → updated data is displayed back to the user.
