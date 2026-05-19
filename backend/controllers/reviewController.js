import Review from '../models/reviewModel.js';

// Get all visible reviews
export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ isVisible: true }).sort({ date: -1 });
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ success: false, message: 'Error fetching reviews' });
    }
};

// Get all reviews (admin only)
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error('Get all reviews error:', error);
        res.status(500).json({ success: false, message: 'Error fetching reviews' });
    }
};

// Add review (admin only)
export const addReview = async (req, res) => {
    try {
        const { customerName, rating, reviewText } = req.body;

        if (!customerName || !rating || !reviewText) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const review = new Review({
            customerName,
            rating,
            reviewText
        });
        await review.save();

        res.status(201).json({ success: true, review, message: 'Review added successfully' });
    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({ success: false, message: 'Error adding review' });
    }
};

// Edit review (admin only)
export const editReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { customerName, rating, reviewText, isVisible } = req.body;

        const review = await Review.findByIdAndUpdate(
            id,
            { customerName, rating, reviewText, isVisible },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({ success: true, review, message: 'Review updated successfully' });
    } catch (error) {
        console.error('Edit review error:', error);
        res.status(500).json({ success: false, message: 'Error updating review' });
    }
};

// Delete review (admin only)
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndDelete(id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ success: false, message: 'Error deleting review' });
    }
};
