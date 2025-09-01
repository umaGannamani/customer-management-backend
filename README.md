# 🛠️ Customer Management Backend

This is the backend API for the **Customer Management Application**.  
It is built with **Node.js**, **Express.js**, and **SQLite**.

---

## 🚀 Features
- Customer CRUD operations:
  - ➕ Create new customer
  - 📄 Retrieve all customers / single customer by ID
  - ✏️ Update customer
  - ❌ Delete customer
- SQLite database for persistent storage
- RESTful API with JSON responses
- CORS enabled for frontend integration

---
Setup Database

If database file doesn’t exist, create it:

mkdir db
touch db/database.sqlite


Run migrations (if any), or manually create the customers table:

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  only_one_address INTEGER DEFAULT 0
);
Server will run at:
👉 http://localhost:5000

🛠️ API Endpoints
1. Get all customers
GET /customers

2. Get customer by ID
GET /customers/:id

3. Create customer
POST /customers
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "1234567890",
  "email": "john@example.com",
  "only_one_address": 1
}

4. Update customer
PUT /customers/:id
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Doe",
  "phone_number": "9876543210",
  "email": "jane@example.com",
  "only_one_address": 0
}

5. Delete customer
DELETE /customers/:id

🔧 Tech Stack

Backend: Node.js, Express.js

Database: SQLite

Dev Tools: Nodemon

📜 Scripts

Start development server:

npm run dev


Start production server:

npm start
