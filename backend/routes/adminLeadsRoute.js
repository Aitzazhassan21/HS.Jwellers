import express from 'express';
import { getAllLeads } from '../controllers/leadController.js';

const router = express.Router();

router.get('/', getAllLeads);

export default router;
