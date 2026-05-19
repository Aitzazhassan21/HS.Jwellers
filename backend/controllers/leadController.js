import LeadEmail from '../models/leadEmailModel.js';

// Generate random coupon code
const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'OPTICAL';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Claim discount coupon
export const claimCoupon = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Check if email already exists
        const existingLead = await LeadEmail.findOne({ email });
        if (existingLead) {
            return res.status(200).json({ 
                success: true, 
                couponCode: existingLead.couponCode,
                message: 'You already have a coupon code!'
            });
        }

        // Generate new coupon code
        const couponCode = generateCouponCode();

        // Save to database
        const leadEmail = new LeadEmail({
            email,
            couponCode
        });
        await leadEmail.save();

        res.status(200).json({ success: true, couponCode, message: 'Coupon claimed successfully!' });
    } catch (error) {
        console.error('Claim coupon error:', error);
        res.status(500).json({ success: false, message: 'Error claiming coupon' });
    }
};

// Get all lead emails (admin only)
export const getAllLeads = async (req, res) => {
    try {
        const leads = await LeadEmail.find().sort({ claimedAt: -1 });
        res.status(200).json({ success: true, leads });
    } catch (error) {
        console.error('Get leads error:', error);
        res.status(500).json({ success: false, message: 'Error fetching leads' });
    }
};
