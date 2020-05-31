const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const PaymentController = require('../controllers/payment');

router.get('', UserController.authMiddleware, PaymentController.getPendingPayments);

module.exports = router;