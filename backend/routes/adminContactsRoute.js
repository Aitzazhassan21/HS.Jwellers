import express from 'express';
import { getAllContacts, markAsRead } from '../controllers/contactController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', adminAuth, getAllContacts);
router.put('/:id/read', adminAuth, markAsRead);

export default router;
