import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { productAPI, categoryAPI, uploadAPI } from "../../services/api.js";
import { getProductImage } from "../../utils/imageHelpers.js";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    discountPrice: "",
    material: "Gold Plated",
    colors: [],
    stock: "",
    isFeatured: false,
    isNewArrival: false,
    tags: [],
    images: [],
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAllAdmin({ limit: 50 });
      const items = response.data?.products || response.data?.data?.products || [];
      setProducts(Array.isArray(items) ? items : []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      const items = response.data?.categories || response.data?.data || [];
      setCategories(Array.isArray(items) ? items : []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        const response = await uploadAPI.uploadImage(formData);
        if (response.data?.success) {
          newImages.push({
            url: response.data.url,
            public_id: response.data.public_id,
          });
          toast.success('Image uploaded!');
        }
      } catch (error) {
        toast.error('Upload failed: ' + error.message);
      }
    }

    setFormData({ ...formData, images: [...formData.images, ...newImages] });
    setUploading(false);
  };

  const handleImageDelete = async (public_id, index) => {
    try {
      await uploadAPI.deleteImage(public_id);
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      toast.success('Image removed!');
    } catch (error) {
      toast.error('Delete failed!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        stock: Number(formData.stock),
        category: formData.category,
      };

      if (editingProduct) {
        await productAPI.update(editingProduct._id, payload);
        toast.success("Product updated successfully");
      } else {
        await productAPI.create(payload);
        toast.success("Product added successfully");
      }

      setDrawerOpen(false);
      resetForm();
      loadProducts();
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category?._id || product.category || "",
      subcategory: product.subcategory || "",
      price: product.price || "",
      discountPrice: product.discountPrice || "",
      material: product.material || "Gold Plated",
      colors: product.colors || [],
      stock: product.stock || "",
      isFeatured: product.isFeatured || false,
      isNewArrival: product.isNewArrival || false,
      tags: product.tags || [],
      images: product.images || [],
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    try {
      // 1. Delete all images from Cloudinary first
      if (product.images?.length > 0) {
        for (const img of product.images) {
          if (img.public_id) {
            await uploadAPI.deleteImage(img.public_id);
          }
        }
      }

      // 2. Delete product from MongoDB
      await productAPI.delete(product._id);

      // 3. Update UI
      setProducts(prev =>
        prev.filter(p => p._id !== product._id)
      );
      toast.success(`"${product.name}" deleted!`);

    } catch (error) {
      toast.error('Delete failed: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      subcategory: "",
      price: "",
      discountPrice: "",
      material: "Gold Plated",
      colors: [],
      stock: "",
      isFeatured: false,
      isNewArrival: false,
      tags: [],
      images: [],
    });
    setEditingProduct(null);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    resetForm();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-3xl text-text-dark mb-2">Products</h1>
          <p className="text-text-muted text-sm font-inter">Manage catalogue items.</p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 bg-[#debc65] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#C9A84C] transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#debc65]/20 border-t-[#debc65] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#debc65]/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#FFFCF5] border-b border-[#debc65]/20">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Product</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Category</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Price</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Stock</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Status</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-[#debc65]/10 hover:bg-[#FFFCF5]/50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        {product.images?.[0]?.url && (
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-medium text-[#1A1A1A]">{product.name}</p>
                          <p className="text-xs text-text-muted">{product.slug}</p>
                        </div>
                      </div>
                      {product.images?.length > 1 && (
                        <div className="flex items-center gap-1">
                          {product.images.slice(0, 3).map((img) => (
                            <img
                              key={img.public_id || img.url}
                              src={img.url}
                              alt={product.name}
                              className="w-8 h-8 object-cover rounded-md border border-[#debc65]/20"
                            />
                          ))}
                          {product.images.length > 3 && (
                            <span className="text-xs text-text-muted">+{product.images.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">{product.category?.name || "-"}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#debc65]">
                    Rs {product.discountPrice || product.price}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">{product.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {product.isFeatured && (
                        <span className="px-2 py-1 bg-[#debc65]/10 text-[#debc65] text-xs rounded-full">Featured</span>
                      )}
                      {product.isNewArrival && (
                        <span className="px-2 py-1 bg-[#1A1A2E]/10 text-[#1A1A2E] text-xs rounded-full">New</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-[#1A1A2E] hover:bg-[#debc65]/10 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={closeDrawer}></div>
          <div className="relative ml-auto h-full w-full max-w-2xl bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#debc65]/20 px-6 py-4 flex items-center justify-between">
              <h2 className="font-playfair text-xl font-bold text-[#1A1A1A]">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={closeDrawer} className="p-2 hover:bg-[#FFFCF5] rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-[#debc65]/20 rounded-lg focus:outline-none focus:border-[#debc65]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-[#debc65]/20 rounded-lg focus:outline-none focus:border-[#debc65]"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-[#debc65]/20 rounded-lg focus:outline-none focus:border-[#debc65]"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Price *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-[#debc65]/20 rounded-lg focus:outline-none focus:border-[#debc65]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Discount Price</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-[#debc65]/20 rounded-lg focus:outline-none focus:border-[#debc65]"
                  />
                </div>
              </div>

              {/* Stock & Material */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-[#debc65]/20 rounded-lg focus:outline-none focus:border-[#debc65]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Material</label>
                  <select
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-4 py-2 border border-[#debc65]/20 rounded-lg focus:outline-none focus:border-[#debc65]"
                  >
                    <option value="Gold Plated">Gold Plated</option>
                    <option value="Silver Plated">Silver Plated</option>
                    <option value="Kundan">Kundan</option>
                    <option value="Oxidised">Oxidised</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#debc65]"
                  />
                  <span className="text-sm text-[#1A1A1A]">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="w-4 h-4 accent-[#debc65]"
                  />
                  <span className="text-sm text-[#1A1A1A]">New Arrival</span>
                </label>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Images</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    handleImageUpload([...e.dataTransfer.files])
                  }}
                  onClick={() => document.getElementById('image-upload').click()}
                  style={{
                    background: '#FFFCF5',
                    border: '2px dashed #debc65',
                    borderRadius: '12px',
                    padding: '32px',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    ref={(el) => { if (el) window.fileInputRef = el }}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload([...e.target.files])}
                    disabled={uploading}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <ImageIcon size={32} style={{ color: '#debc65' }} />
                  <p style={{ marginTop: '8px', color: '#666' }}>
                    Drop images here or click to upload
                  </p>
                  <p style={{ fontSize: '12px', color: '#999' }}>
                    JPG, PNG, WEBP supported
                  </p>
                  {uploading && (
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <div style={{ width: '16px', height: '16px', border: '2px solid #debc65', borderTop: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      <span style={{ color: '#debc65', fontSize: '12px' }}>Uploading images to Cloudinary...</span>
                    </div>
                  )}
                </div>

                {formData.images.length > 0 && (
                  <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {formData.images.map((image, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        {index === 0 && (
                          <span style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            background: '#1A1A2E',
                            color: '#debc65',
                            fontSize: '10px',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontWeight: '500'
                          }}>
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleImageDelete(image.public_id, index)}
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#EF4444',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex-1 px-4 py-2 border border-[#debc65]/20 rounded-lg font-medium hover:bg-[#FFFCF5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#debc65] text-black rounded-lg font-medium hover:bg-[#C9A84C] transition-colors"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
