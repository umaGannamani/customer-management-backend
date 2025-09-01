// routes/customers.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const controller = require('../controllers/customerController');

router.post(
  '/',
  [
    body('first_name').notEmpty().withMessage('first_name required'),
    body('last_name').notEmpty().withMessage('last_name required'),
    body('phone_number').notEmpty().withMessage('phone_number required')
  ],
  controller.createCustomer
);

router.get('/', controller.listCustomers);
router.get('/:id', controller.getCustomer);
router.put('/:id', controller.updateCustomer);
router.delete('/:id', controller.deleteCustomer);

module.exports = router;
