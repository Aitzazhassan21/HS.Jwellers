import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { toast } from "react-toastify";
import { Upload, X } from "lucide-react";

const Add = ({ token }) => {
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [material, setMaterial] = useState("Gold Plated");
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Enforce max 5 images per product
    const existingCount = images.length;
    if (existingCount >= 5) {
      toast.error("Maximum 5 images allowed per product");
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const response = await axios.post(`${backendUrl}/api/upload/image`, formData, {
          headers: { ...authHeaders, "Content-Type": "multipart/form-data" },
        });
        return response.data.image;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const combined = [...images, ...uploadedImages].slice(0, 5);
      if (combined.length < images.length + uploadedImages.length) {
        toast.info("Only first 5 images were kept");
      }
      setImages(combined);
      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await axios.get(`${backendUrl}/api/categories`);
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        backendUrl + "/api/products",
        {
          name,
          description,
          category,
          price: Number(price),
          discountPrice: discountPrice ? Number(discountPrice) : 0,
          stock: Number(stock),
          isFeatured,
          isNewArrival,
          material,
          images,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        },
        { headers: authHeaders }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const resetForm = () => {
    setImages([]);
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setDiscountPrice("");
    setStock("");
    setIsFeatured(false);
    setIsNewArrival(false);
    setMaterial("Gold Plated");
  };

  return (
    <form onSubmit={onSubmitHandler} className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Jewelry Product</h2>
      </div>

      {/* Image Upload */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Product Images</label>
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-[#debc65] transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <p className="text-sm text-slate-600">
              {uploading ? "Uploading..." : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 10MB</p>
          </label>
        </div>
        {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img.url}
                alt={`Product ${index + 1}`}
                className="w-full h-24 sm:h-28 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      </div>
      {/* Tags input */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., Kundan, Wedding, Bridal"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#debc65] focus:border-transparent"
        />
        <p className="text-xs text-slate-400 mt-2">Tags will appear on product page above price (italic).</p>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#debc65] focus:border-transparent"
            placeholder="e.g., Gold Plated Kundan Necklace Set"
            required
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#debc65] focus:border-transparent"
            required
          >
            <option value="">Select Category</option>
            {loadingCategories ? (
              <option value="" disabled>Loading categories...</option>
            ) : categories.length === 0 ? (
              <option value="" disabled>No categories available</option>
            ) : (
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Price (PKR) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#debc65] focus:border-transparent"
            placeholder="e.g., 5000"
            required
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Discount Price (PKR)</label>
          <input
            type="number"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#debc65] focus:border-transparent"
            placeholder="e.g., 4500"
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Stock Quantity *</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#debc65] focus:border-transparent"
            placeholder="e.g., 50"
            required
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Material</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#debc65] focus:border-transparent"
          >
            <option value="Gold Plated">Gold Plated</option>
            <option value="Silver Plated">Silver Plated</option>
            <option value="Rose Gold">Rose Gold</option>
            <option value="Brass">Brass</option>
            <option value="Kundan">Kundan</option>
            <option value="Pearl">Pearl</option>
            <option value="Crystal">Crystal</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#debc65] focus:border-transparent resize-none"
          placeholder="Describe the jewelry piece, its design, materials, and occasions suitable for..."
          required
        />
      </div>

      {/* Product Flags */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 cursor-pointer hover:border-[#debc65] transition-colors">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 text-[#debc65] rounded focus:ring-[#debc65]"
          />
          <span className="text-sm font-medium text-slate-700">Featured Product</span>
        </label>

        <label className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 cursor-pointer hover:border-[#debc65] transition-colors">
          <input
            type="checkbox"
            checked={isNewArrival}
            onChange={(e) => setIsNewArrival(e.target.checked)}
            className="w-4 h-4 text-[#debc65] rounded focus:ring-[#debc65]"
          />
          <span className="text-sm font-medium text-slate-700">New Arrival</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 bg-gradient-to-r from-[#debc65] to-[#C9A84C] text-white px-8 py-4 rounded-xl font-semibold hover:from-[#C9A84C] hover:to-[#B69A45] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#debc65]/20"
        >
          {uploading ? "Uploading..." : "Add Product"}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default Add;
