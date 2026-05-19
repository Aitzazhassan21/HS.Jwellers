export default function handler(req, res) {
  const mongodbUri = process.env.MONGODB_URI;

  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    env: {
      mongodb_uri_set: !!mongodbUri,
      mongodb_uri_preview: mongodbUri ? mongodbUri.substring(0, 40) + '...' : null,
      jwt_secret_set: !!process.env.JWT_SECRET,
      admin_email_set: !!process.env.ADMIN_EMAIL,
      admin_password_set: !!process.env.ADMIN_PASSWORD,
      node_env: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
    }
  });
}
