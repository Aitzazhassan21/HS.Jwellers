import mongoose from 'mongoose';

const leadEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    couponCode: {
        type: String,
        required: true,
        unique: true
    },
    claimedAt: {
        type: Date,
        default: Date.now
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('LeadEmail', leadEmailSchema);
