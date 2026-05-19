import express from 'express';
import { getSiteSettings, updateSiteSettings, getPublicSiteSettings } from '../controllers/siteSettingsController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', adminAuth, getSiteSettings);
router.put('/', adminAuth, updateSiteSettings);
router.get('/public', getPublicSiteSettings);

export default router;
