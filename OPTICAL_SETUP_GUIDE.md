# Optical/Eyewear Website - Setup Guide

## Project Overview
This is a professional UK-based optical brand website converted from the Sapphire MERN E-Commerce template. The site includes a premium frontend, backend API, and admin panel with full integration.

## Features Implemented

### Frontend
- ✅ Updated Navbar with category routes (Men, Women, Unisex, Child, Sunglasses)
- ✅ Scrolling Announcement Bar with CSS marquee animation
- ✅ Premium HeroSection with optical branding
- ✅ Reviews Section displaying customer reviews
- ✅ Discount Popup with email capture and coupon generation
- ✅ Professional Contact Page with email confirmation
- ✅ Category pages for filtered product browsing

### Backend
- ✅ New Models: LeadEmail, Review, ContactMessage
- ✅ New Routes: Contact, Coupons, Reviews, Admin (Leads, Reviews, Contacts)
- ✅ Nodemailer integration for email confirmations
- ✅ Coupon code generation system

### Admin Panel
- ✅ Professional dark sidebar with navigation
- ✅ Dashboard with analytics and charts
- ✅ Products management (existing Add/List pages)
- ✅ Orders management (existing Orders page)
- ✅ Users management page
- ✅ Lead Emails management page
- ✅ Reviews management (add/edit/delete)
- ✅ Contact Messages management
- ✅ Settings page

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Copy `.env.example` to `.env` and update with your credentials:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret

# Email Configuration for Nodemailer
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
```

#### Get Gmail App Password
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Create a new app password for "Mail"
5. Use this password in `EMAIL_PASS` (not your regular Gmail password)

#### Start Backend Server
```bash
npm run server
```
Backend will run on `http://localhost:5000`

### 2. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Frontend Server
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

### 3. Admin Panel Setup

#### Install Dependencies
```bash
cd admin
npm install
```

#### Start Admin Server
```bash
npm run dev
```
Admin will run on `http://localhost:5173` (or similar Vite port)

## API Endpoints

### Public Routes
- `POST /api/contact` - Submit contact form
- `POST /api/coupons/claim` - Claim discount coupon
- `GET /api/reviews` - Get visible reviews
- `GET /api/product?category=X` - Get products by category

### Admin Routes (Require Authentication)
- `GET /api/admin/leads` - Get all lead emails
- `GET /api/admin/reviews` - Get all reviews
- `POST /api/admin/reviews` - Add review
- `PUT /api/admin/reviews/:id` - Edit review
- `DELETE /api/admin/reviews/:id` - Delete review
- `GET /api/admin/contacts` - Get all contact messages
- `PUT /api/admin/contacts/:id/read` - Mark contact as read

## File Structure

### Frontend Components
- `AnnouncementBar.jsx` - Scrolling marquee bar
- `HeroSection.jsx` - Premium hero section
- `ReviewsSection.jsx` - Customer reviews display
- `DiscountPopup.jsx` - Email capture popup
- `NavBar.jsx` - Updated with category links

### Frontend Pages
- `Category.jsx` - Category product filtering
- `Contact.jsx` - Professional contact form

### Backend Models
- `leadEmailModel.js` - Email & coupon storage
- `reviewModel.js` - Customer reviews
- `contactMessageModel.js` - Contact form messages

### Backend Controllers
- `contactController.js` - Contact form + email sending
- `leadController.js` - Coupon generation
- `reviewController.js` - Review management

### Admin Pages
- `Dashboard.jsx` - Analytics overview
- `Users.jsx` - User management
- `Leads.jsx` - Lead email management
- `Reviews.jsx` - Review management
- `Contacts.jsx` - Contact message management
- `Settings.jsx` - Store settings

## Design System

### Colors
- Primary: Blue (#2563eb) to Indigo (#4f46e5) gradient
- Background: Slate (#f1f5f9)
- Text: Slate (#0f172a, #475569)
- Accent: Gold (#FACC15) for stars

### Typography
- Headings: Font black, tight tracking
- Body: Clean, readable with good line height
- Premium optical brand feel

## Important Notes

1. **Email Configuration**: You must set up Gmail App Password for contact form emails to work
2. **MongoDB**: Ensure MongoDB is running locally or update MONGODB_URI with your cloud MongoDB connection
3. **Cloudinary**: Update Cloudinary credentials for image uploads
4. **JWT Secret**: Use a strong random string for JWT_SECRET in production

## Testing the Features

1. **Announcement Bar**: Visible on all pages above navbar
2. **Category Routes**: Navigate to /category/men, /category/women, etc.
3. **Discount Popup**: Shows on page load/refresh (no localStorage suppression)
4. **Contact Form**: Submit form and check email for confirmation
5. **Admin Panel**: Login and navigate to Dashboard, Leads, Reviews, Contacts

## Next Steps

1. Add sample products to MongoDB with category field (men, women, unisex, child, sunglasses)
2. Add sample reviews via admin panel
3. Test contact form with real email
4. Customize hero image and branding assets
5. Update store name and contact information in components

## Support

For issues or questions, check the console logs for error messages. Ensure all three servers (backend, frontend, admin) are running simultaneously.
