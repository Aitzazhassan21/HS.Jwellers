import { v2 as cloudinary } from "cloudinary";

// POST /api/upload/image — admin, Cloudinary
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Convert buffer to base64 for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "hs-glamour/products",
      resource_type: "image",
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });

    res.status(200).json({
      success: true,
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/upload/image — admin
export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ success: false, message: "Public ID required" });
    }

    await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ success: true, message: "Image deleted" });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
