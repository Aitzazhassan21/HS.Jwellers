import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isVisible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Review', reviewSchema);
