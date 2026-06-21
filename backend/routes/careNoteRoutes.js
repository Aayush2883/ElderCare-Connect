import express from 'express';
import { createCareNote, getCareNotesByBooking } from '../controllers/careNoteController.js';
import { protect, caregiverOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All care note routes require login

router.post('/', caregiverOnly, createCareNote);
router.get('/booking/:bookingId', getCareNotesByBooking);

export default router;
