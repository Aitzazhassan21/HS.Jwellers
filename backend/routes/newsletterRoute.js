import express from 'express';
import { subscribeNewsletter, getNewsletterEmails, deleteNewsletterEmail } from '../controllers/newsletterController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public route
router.post('/', subscribeNewsletter);

// Admin routes
router.get('/admin', adminAuth, getNewsletterEmails);
router.delete('/admin/:id', adminAuth, deleteNewsletterEmail);

export default router;
