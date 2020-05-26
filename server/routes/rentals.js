const express = require('express');
const router = express.Router();

const RentalController = require('../controllers/rental');
const UserController = require('../controllers/user');

router.get('', RentalController.getRentals);
router.get('/count', RentalController.countRentals);
router.get('/manage', UserController.authMiddleware, RentalController.getRentalsByUser);
router.get('/:id', RentalController.getRentalById);
router.post('', UserController.authMiddleware, RentalController.addRental);
router.delete('/:id', UserController.authMiddleware, RentalController.deleteRental);
router.put('/:id', UserController.authMiddleware, RentalController.updateRental);

module.exports = router;