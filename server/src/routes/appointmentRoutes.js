const express = require('express');
const router = express.Router();
const { getAvailableAppointments, bookAppointment, cancelAppointment, getMyAppointments } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/available', protect, getAvailableAppointments);
router.get('/my', protect, allowRoles('PATIENT'), getMyAppointments);
router.post('/book', protect, allowRoles('PATIENT'), bookAppointment);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;
