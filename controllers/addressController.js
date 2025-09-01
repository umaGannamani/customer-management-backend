// controllers/addressController.js
const db = require('../db');
const { validationResult } = require('express-validator');

exports.createAddress = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const customer_id = req.params.id;
  const { address_details, city, state, pin_code, is_primary } = req.body;
  const sql = `INSERT INTO addresses (customer_id,address_details,city,state,pin_code,is_primary)
               VALUES (?,?,?,?,?,?)`;
  db.run(sql, [customer_id, address_details, city, state, pin_code, is_primary ? 1 : 0], function (err) {
    if (err) return next(err);
    // update customer's only_one_address flag
    db.get('SELECT COUNT(*) as cnt FROM addresses WHERE customer_id=?', [customer_id], (e, row) => {
      if (e) return next(e);
      const onlyOne = row.cnt === 1 ? 1 : 0;
      db.run('UPDATE customers SET only_one_address=? WHERE id=?', [onlyOne, customer_id], (uErr) => {
        if (uErr) console.error('Failed to update only_one_address', uErr);
        res.status(201).json({ id: this.lastID, message: 'Address created' });
      });
    });
  });
};

exports.getAddressesByCustomer = (req, res, next) => {
  const customer_id = req.params.id;
  db.all('SELECT * FROM addresses WHERE customer_id=?', [customer_id], (err, rows) => {
    if (err) return next(err);
    res.json({ data: rows });
  });
};

exports.updateAddress = (req, res, next) => {
  const id = req.params.id;
  const { address_details, city, state, pin_code, is_primary } = req.body;
  db.get('SELECT customer_id FROM addresses WHERE id=?', [id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ message: 'Address not found' });
    const cid = row.customer_id;
    db.run(
      'UPDATE addresses SET address_details=?,city=?,state=?,pin_code=?,is_primary=? WHERE id=?',
      [address_details, city, state, pin_code, is_primary ? 1 : 0, id],
      function (err2) {
        if (err2) return next(err2);
        db.get('SELECT COUNT(*) as cnt FROM addresses WHERE customer_id=?', [cid], (e, r) => {
          if (e) return next(e);
          const onlyOne = r.cnt === 1 ? 1 : 0;
          db.run('UPDATE customers SET only_one_address=? WHERE id=?', [onlyOne, cid], (uErr) => {
            if (uErr) console.error('Failed to update only_one_address', uErr);
            res.json({ message: 'Address updated' });
          });
        });
      }
    );
  });
};

exports.deleteAddress = (req, res, next) => {
  const id = req.params.id;
  db.get('SELECT customer_id FROM addresses WHERE id=?', [id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ message: 'Address not found' });
    const cid = row.customer_id;
    db.run('DELETE FROM addresses WHERE id=?', [id], function (err2) {
      if (err2) return next(err2);
      db.get('SELECT COUNT(*) as cnt FROM addresses WHERE customer_id=?', [cid], (e, r) => {
        if (e) return next(e);
        const onlyOne = r.cnt === 1 ? 1 : 0;
        db.run('UPDATE customers SET only_one_address=? WHERE id=?', [onlyOne, cid], (uErr) => {
          if (uErr) console.error('Failed to update only_one_address', uErr);
          res.json({ message: 'Address deleted' });
        });
      });
    });
  });
};
