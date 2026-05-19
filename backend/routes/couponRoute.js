import express from 'express';
import { claimCoupon } from '../controllers/leadController.js';

const router = express.Router();

router.post('/claim', claimCoupon);

export default router;
