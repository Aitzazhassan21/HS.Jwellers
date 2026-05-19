import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { resolveImageUrl } from "../utils/imageHelpers";
import { toast } from "react-toastify";
import { Upload, X, Plus, Trash2, Edit, FolderOpen } from "lucide-react";

const Categories = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    featured: false,
    order: 0,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/categories`);
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const authHeaders = { Authorization: `Bearer ${token}` };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(`${backendUrl}/api/upload/image`, formData, {
        headers: { ...authHeaders, "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, image: response.data.image }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        image: formData.image,
        featured: formData.featured,
        order: formData.order,
      };

      let response;
      if (editingCategory) {
        response = await axios.put(`${backendUrl}/api/categories/${editingCategory._id}`, payload, {
          headers: authHeaders,
        });
      } else {
        response = await axios.post(`${backendUrl}/api/categories`, payload, {
          headers: authHeaders,
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        resetForm();
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (!globalThis.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const response = await axios.delete(`${backendUrl}/api/categories/${id}`, {
        headers: authHeaders,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      image: category.image,
      featured: category.featured,
      order: category.order,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      image: null,
      featured: false,
      order: 0,
    });
    setEditingCategory(null);
  };

  let submitLabel;
  if (uploading) {
    submitLabel = "Uploading...";
  } else if (editingCategory) {
    submitLabel = "Update";
  } else {
    submitLabel = "Add Category";
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#debc65]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Categories</h1>
          <p className="text-slate-500 font-medium">Manage your jewelry categories</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#debc65] to-[#C9A84C] text-white font-bold rounded-2xl shadow-lg shadow-[#debc65]/20 transition-all hover:scale-105"
        >
          <Plus size={20} strokeWidth={3} />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FolderOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No categories found. Add your first category!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Category Image */}
              <div className="relative h-40 bg-gradient-to-br from-[#FFF8E7] to-[#F4E0A0] overflow-hidden">
                {category.image?.url ? (
                  <img
                    src={category.image ? resolveImageUrl(category.image) : null}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <FolderOpen size={48} />
                  </div>
                )}
                {category.featured && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-[#debc65] to-[#C9A84C] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Category Details */}
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{category.name}</h3>
                <p className="text-xs text-slate-500 mb-4">Order: {category.order}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label htmlFor="category-image-upload" className="block text-sm font-semibold text-slate-700 mb-3">Category Image</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-[#debc65] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="category-image-upload"
                  />
                  <label htmlFor="category-image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">
                      {uploading ? "Uploading..." : "Click to upload"}
                    </p>
                  </label>
                </div>
                {formData.image?.url && (
                  <div className="mt-3 relative">
                    <img
                      src={formData.image ? resolveImageUrl(formData.image) : null}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="category-name" className="block text-sm font-semibold text-slate-700 mb-2">Category Name *</label>
                <input
                  id="category-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#debc65] focus:border-transparent"
                  placeholder="e.g., Necklaces & Sets"
                  required
                />
              </div>

              {/* Order */}
              <div>
                <label htmlFor="category-order" className="block text-sm font-semibold text-slate-700 mb-2">Display Order</label>
                <input
                  id="category-order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, order: Number.parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#debc65] focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {/* Featured */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-[#debc65] rounded focus:ring-[#debc65]"
                />
                <span className="text-sm font-medium text-slate-700">Featured Category</span>
              </label>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-[#debc65] to-[#C9A84C] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#C9A84C] hover:to-[#B69A45] transition-all disabled:opacity-50"
                >
                  {submitLabel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
