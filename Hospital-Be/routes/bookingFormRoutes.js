
const express = require('express');
const router = express.Router();
const bookingFormController = require('../controllers/bookingFormController');

// Save multiple appointment sessions
router.post('/multiple', bookingFormController.saveMultipleSessions);

// Get appointments for a specific doctor
router.get('/doctor/:doctorId', bookingFormController.getAppointmentsByDoctor);

// Update appointment by ID
router.put('/:id', bookingFormController.updateAppointment);

// Delete appointment by ID
router.delete('/:id', bookingFormController.deleteAppointment);

router.post("/sessions/multiple", bookingFormController.saveMultipleSessions);

module.exports = router;






