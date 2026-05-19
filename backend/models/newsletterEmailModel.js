import mongoose from 'mongoose';

const newsletterEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

const newsletterEmailModel = mongoose.models.newsletterEmail || mongoose.model('newsletterEmail', newsletterEmailSchema);

export default newsletterEmailModel;
