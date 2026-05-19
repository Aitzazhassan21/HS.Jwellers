import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { categoryAPI, uploadAPI } from "../../services/api.js";
import slugify from "slugify";
import { getCategoryImage } from "../../utils/imageHelpers.js";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: null,
    subcategories: [],
    featured: false,
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      const items = response.data?.categories || response.data?.data || [];
      setCategories(Array.isArray(items) ? items : []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await uploadAPI.uploadImage(formData);
      if (response.data?.success) {
        // Delete old image from Cloudinary first if exists
        if (formData.image?.public_id) {
          try {
            await uploadAPI.deleteImage(formData.image.public_id);
          } catch {
            // Ignore error on delete
          }
        }
        setFormData({ ...formData, image: { url: response.data.url, public_id: response.data.public_id } });
        toast.success('Category image uploaded!');
      }
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = async () => {
    if (formData.image?.public_id) {
      try {
        await uploadAPI.deleteImage(formData.image.public_id);
      } catch {
        // Ignore error on remove
      }
    }
    setFormData({ ...formData, image: null });
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = slugify(name, { lower: true, strict: true });
    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        image: formData.image || { url: "", public_id: "" },
        subcategories: formData.subcategories,
        featured: formData.featured,
        order: Number(formData.order),
      };

      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, payload);
        toast.success("Category updated successfully");
      } else {
        await categoryAPI.create(payload);
        toast.success("Category added successfully");
      }

      setModalOpen(false);
      resetForm();
      loadCategories();
    } catch {
      toast.error("Failed to save category");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      image: category.image || null,
      subcategories: category.subcategories || [],
      featured: category.featured || false,
      order: category.order || 0,
      isActive: category.isActive !== undefined ? category.isActive : true,
    });
    setModalOpen(true);
  };

  const handleDelete = async (category) => {
    if (!window.confirm(
      `Delete "${category.name}"? All products will be unlinked.` 
    )) return;

    try {
      // 1. Delete category image from Cloudinary
      if (category.image?.public_id) {
        await uploadAPI.deleteImage(category.image.public_id);
      }

      // 2. Delete category from MongoDB
      await categoryAPI.delete(category._id);

      // 3. Update UI
      setCategories(prev =>
        prev.filter(c => c._id !== category._id)
      );
      toast.success(`"${category.name}" deleted!`);

    } catch (error) {
      toast.error('Delete failed: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      image: null,
      subcategories: [],
      featured: false,
      order: 0,
      isActive: true,
    });
    setEditingCategory(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-3xl text-text-dark mb-2">Categories</h1>
          <p className="text-text-muted text-sm font-inter">Manage product categories.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#debc65] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#C9A84C] transition-colors"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#debc65]/20 border-t-[#debc65] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl border border-[#debc65]/20 overflow-hidden group"
            >
              <div className="relative aspect-[4/3] bg-[#FFFCF5]">
                {category.image?.url ? (
                  <img
                    src={getCategoryImage(category)}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    No Image
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 bg-white rounded-lg shadow-md hover:bg-[#FFFCF5]"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {category.featured && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-[#debc65] text-black text-xs rounded-full font-medium">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-playfair text-lg font-bold text-[#1A1A1A] mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-text-muted mb-3">{category.slug}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Order: {category.order}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      category.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={closeModal}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#debc65]/20 px-6 py-4 flex items-center justify-between">
              <h2 className="font-playfair text-xl font-bold text-[#1A1A1A]">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-[#FFFCF5] rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-2 border border-[#debc65]/20 rounded-lg focus:outline-none focus:border-[#debc65]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-[#debc65]/20 rounded-lg focus:outline-none focus:border-[#debc65] bg-gray-50"
                  readOnly
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-4 py-2 border border-[#debc65]/20 rounded-lg focus:outline-none focus:border-[#debc65]"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#debc65]"
                  />
                  <span className="text-sm text-[#1A1A1A]">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#debc65]"
                  />
                  <span className="text-sm text-[#1A1A1A]">Active</span>
                </label>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Category Image</label>
                {!formData.image?.url ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      handleImageUpload(e.dataTransfer.files[0])
                    }}
                    onClick={() => document.getElementById('category-image-upload').click()}
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
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      disabled={uploading}
                      style={{ display: 'none' }}
                      id="category-image-upload"
                    />
                    <Upload size={32} style={{ color: '#debc65' }} />
                    <p style={{ marginTop: '8px', color: '#666' }}>
                      {uploading ? "Uploading to Cloudinary..." : "Drop image here or click to upload"}
                    </p>
                    <p style={{ fontSize: '12px', color: '#999' }}>
                      JPG, PNG, WEBP supported
                    </p>
                  </div>
                ) : (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={formData.image.url}
                      alt="Category preview"
                      style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <button
                      type="button"
                      onClick={handleImageRemove}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        padding: '8px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Change Image
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-[#debc65]/20 rounded-lg font-medium hover:bg-[#FFFCF5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#debc65] text-black rounded-lg font-medium hover:bg-[#C9A84C] transition-colors"
                >
                  {editingCategory ? "Update Category" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
