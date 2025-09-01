// controllers/customerController.js
const db = require('../db');
const { validationResult } = require('express-validator');

exports.createCustomer = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { first_name, last_name, phone_number, email, only_one_address } = req.body;
  const sql = `INSERT INTO customers (first_name,last_name,phone_number,email,only_one_address)
               VALUES (?,?,?,?,?)`;
  db.run(sql, [first_name, last_name, phone_number, email || null, only_one_address ? 1 : 0], function (err) {
    if (err) return next(err);
    res.status(201).json({ id: this.lastID, message: 'Customer created' });
  });
};

exports.listCustomers = (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search,
    city,
    state,
    pin_code,
    sortBy = 'created_at',
    order = 'DESC'
  } = req.query;
  const offset = (page - 1) * limit;
  let where = [];
  let params = [];

  if (search) {
    where.push('(first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (city) {
    where.push('id IN (SELECT customer_id FROM addresses WHERE city=?)');
    params.push(city);
  }
  if (state) {
    where.push('id IN (SELECT customer_id FROM addresses WHERE state=?)');
    params.push(state);
  }
  if (pin_code) {
    where.push('id IN (SELECT customer_id FROM addresses WHERE pin_code=?)');
    params.push(pin_code);
  }

  const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `SELECT * FROM customers ${whereSQL} ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {
    if (err) return next(err);
    res.json({ data: rows });
  });
};

exports.getCustomer = (req, res, next) => {
  const id = req.params.id;
  const sql = `SELECT * FROM customers WHERE id = ?`;
  db.get(sql, [id], (err, customer) => {
    if (err) return next(err);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    db.all('SELECT * FROM addresses WHERE customer_id=?', [id], (err2, addresses) => {
      if (err2) return next(err2);
      customer.addresses = addresses;
      res.json(customer);
    });
  });
};

exports.updateCustomer = (req, res, next) => {
  const id = req.params.id;
  const { first_name, last_name, phone_number, email, only_one_address } = req.body;
  const sql = `UPDATE customers SET first_name=?, last_name=?, phone_number=?, email=?, only_one_address=? WHERE id=?`;
  db.run(sql, [first_name, last_name, phone_number, email || null, only_one_address ? 1 : 0, id], function (err) {
    if (err) return next(err);
    res.json({ message: 'Customer updated' });
  });
};

exports.deleteCustomer = (req, res, next) => {
  const id = req.params.id;
  // In production, check linked transactions before deleting.
  db.run('DELETE FROM customers WHERE id=?', [id], function (err) {
    if (err) return next(err);
    res.json({ message: 'Customer deleted' });
  });
};
