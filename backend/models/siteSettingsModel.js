import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
    siteTitle: { type: String, default: 'Optical' },
    siteEmail: { type: String, default: 'support@optical.co.uk' },
    sitePhone: { type: String, default: '+44 161 234 5678' },
    siteAddress: { type: String, default: 'Manchester Optical Lab, 123 King Street, Manchester, M1 2AN, UK' },
    currency: { type: String, default: 'GBP' },
    currencySymbol: { type: String, default: '£' },
    deliveryCharge: { type: Number, default: 10 },
    freeDeliveryOver: { type: Number, default: 100 },
    returnPolicy: { type: Number, default: 30 },
    maintenanceMode: { type: Boolean, default: false },
    primaryColor: { type: String, default: '#2563eb' },
    secondaryColor: { type: String, default: '#4f46e5' },
    logoUrl: { type: String, default: '' },
    fontFamily: { type: String, default: 'Inter' }
}, { timestamps: true });

const siteSettingsModel = mongoose.models.siteSettings || mongoose.model('siteSettings', siteSettingsSchema);

export default siteSettingsModel;
