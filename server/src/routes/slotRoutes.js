const express = require('express');
const router = express.Router();
const { createSlot, getAvailableSlots, getMySlots, deleteSlot } = require('../controllers/slotController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/', protect, getAvailableSlots);
router.get('/my', protect, allowRoles('DOCTOR'), getMySlots);
router.post('/', protect, allowRoles('DOCTOR'), createSlot);
router.delete('/:id', protect, allowRoles('DOCTOR'), deleteSlot);

module.exports = router;
