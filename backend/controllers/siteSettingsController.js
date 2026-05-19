import siteSettingsModel from '../models/siteSettingsModel.js';

// Get site settings (admin only)
export const getSiteSettings = async (req, res) => {
    try {
        let settings = await siteSettingsModel.findOne();
        if (!settings) {
            settings = await siteSettingsModel.create({});
        }
        res.status(200).json({ success: true, settings });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update site settings (admin only)
export const updateSiteSettings = async (req, res) => {
    try {
        const updateData = req.body;
        let settings = await siteSettingsModel.findOne();
        if (!settings) {
            settings = await siteSettingsModel.create(updateData);
        } else {
            Object.assign(settings, updateData);
            await settings.save();
        }
        res.status(200).json({ success: true, settings, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get site settings for public frontend (no auth required)
export const getPublicSiteSettings = async (req, res) => {
    try {
        let settings = await siteSettingsModel.findOne();
        if (!settings) {
            settings = await siteSettingsModel.create({});
        }
        res.status(200).json({ success: true, settings });
    } catch (error) {
        console.error('Get public settings error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
