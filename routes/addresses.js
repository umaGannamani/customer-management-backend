// routes/addresses.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const controller = require('../controllers/addressController');

// Add address for customer
router.post(
  '/customers/:id/addresses',
  [
    body('address_details').notEmpty().withMessage('address_details required'),
    body('city').notEmpty().withMessage('city required'),
    body('state').notEmpty().withMessage('state required'),
    body('pin_code').notEmpty().withMessage('pin_code required')
  ],
  controller.createAddress
);

// Get addresses for customer
router.get('/customers/:id/addresses', controller.getAddressesByCustomer);

// Update address by id (PUT /api/addresses/:id)
router.put('/addresses/:id', controller.updateAddress);

// Delete address by id (DELETE /api/addresses/:id)
router.delete('/addresses/:id', controller.deleteAddress);

module.exports = router;
