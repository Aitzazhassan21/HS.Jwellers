import newsletterEmailModel from '../models/newsletterEmailModel.js';

// Subscribe to newsletter
export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email address' });
        }

        const existing = await newsletterEmailModel.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(200).json({ success: true, message: 'You are already subscribed!' });
        }

        const subscription = new newsletterEmailModel({ email: email.toLowerCase() });
        await subscription.save();

        res.status(200).json({ success: true, message: 'Thank you! You are subscribed.' });
    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all newsletter subscribers (admin only)
export const getNewsletterEmails = async (req, res) => {
    try {
        const subscribers = await newsletterEmailModel.find().sort({ subscribedAt: -1 });
        res.status(200).json({ success: true, subscribers, count: subscribers.length });
    } catch (error) {
        console.error('Get newsletter emails error:', error);
        res.status(500).json({ success: false, message: 'Error fetching subscribers' });
    }
};

// Delete newsletter subscriber (admin only)
export const deleteNewsletterEmail = async (req, res) => {
    try {
        const { id } = req.params;
        await newsletterEmailModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Subscriber removed' });
    } catch (error) {
        console.error('Delete newsletter email error:', error);
        res.status(500).json({ success: false, message: 'Error removing subscriber' });
    }
};
