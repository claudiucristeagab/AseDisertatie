const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const PaymentController = require('../controllers/payment');

router.get('', UserController.authMiddleware, PaymentController.getPendingPayments);
router.post('/accept', UserController.authMiddleware, PaymentController.acceptPayment);
router.post('/decline', UserController.authMiddleware, PaymentController.declinePayment);

module.exports = router;