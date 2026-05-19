import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../config";
import { toast } from "react-toastify";
import { Trash2, Package, Star } from "lucide-react";
import { resolveImageUrl } from "../utils/imageHelpers";

const List = ({ token }) => {
  const [listProducts, setListProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/products/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setListProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await axios.delete(
        backendUrl + `/api/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchListProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchListProducts();
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
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Product Inventory</h1>
          <p className="text-slate-500 font-medium">Manage your jewelry collection</p>
        </div>
      </div>

      {/* Products Grid */}
      {listProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No products found. Add your first jewelry piece!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listProducts.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-[#FFF8E7] to-[#F4E0A0] overflow-hidden">
                {resolveImageUrl(item.images?.[0]) ? (
                  <img
                    src={resolveImageUrl(item.images?.[0])}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <Package size={48} />
                  </div>
                )}
                {item.isFeatured && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-[#debc65] to-[#C9A84C] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
                {item.isNewArrival && (
                  <span className="absolute top-3 right-3 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>
              {item.images?.length > 1 && (
                <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 overflow-x-auto">
                  <div className="flex items-center gap-2 min-w-full">
                    {item.images.map((img) => (
                      <img
                        key={img.public_id || img.url}
                        src={resolveImageUrl(img)}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Product Details */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 line-clamp-2 flex-1">{item.name}</h3>
                </div>
                
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-[#debc65] bg-[#FFF8E7] px-2 py-1 rounded-full">
                    {item.category?.name || item.category}
                  </span>
                  {item.material && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {item.material}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-black text-[#debc65]">{currency(item.price)}</p>
                    {item.discountPrice && item.discountPrice < item.price && (
                      <p className="text-sm text-slate-400 line-through">{currency(item.price)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-gold text-gold" />
                    <span className="text-sm font-medium text-slate-600">
                      {item.ratings?.average || item.averageRating || 0}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => removeProduct(item._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
