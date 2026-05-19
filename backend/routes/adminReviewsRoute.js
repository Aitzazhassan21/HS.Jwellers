import express from 'express';
import { getAllReviews, addReview, editReview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', getAllReviews);
router.post('/', addReview);
router.put('/:id', editReview);
router.delete('/:id', deleteReview);

export default router;
