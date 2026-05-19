import React, { useEffect, useState } from 'react';
import { Star, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Reviews = ({ token }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    rating: 5,
    reviewText: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [token]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim() || 'https://hsjewelsapi.vercel.app';

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Error fetching reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await axios.put(
          `${backendUrl}/api/admin/reviews/${editingReview._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Review updated successfully');
      } else {
        await axios.post(
          `${backendUrl}/api/admin/reviews`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Review added successfully');
      }
      setShowAddModal(false);
      setEditingReview(null);
      setFormData({ customerName: '', rating: 5, reviewText: '' });
      fetchReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Error saving review');
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      customerName: review.customerName,
      rating: review.rating,
      reviewText: review.reviewText
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await axios.delete(`${backendUrl}/api/admin/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Error deleting review');
    }
  };

  const toggleVisibility = async (review) => {
    try {
      await axios.put(
        `${backendUrl}/api/admin/reviews/${review._id}`,
        { ...review, isVisible: !review.isVisible },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review visibility updated');
      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Error updating review');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? '#FACC15' : 'none'}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Reviews</h1>
          <p className="text-slate-500">Manage customer reviews</p>
        </div>
        <button
          onClick={() => {
            setEditingReview(null);
            setFormData({ customerName: '', rating: 5, reviewText: '' });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          Add Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>
              <button
                onClick={() => toggleVisibility(review)}
                className={`p-2 rounded-lg transition-colors ${
                  review.isVisible ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {review.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">{review.reviewText}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{review.customerName}</p>
                <p className="text-xs text-slate-400">
                  {new Date(review.date).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingReview ? 'Edit Review' : 'Add Review'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>{rating} Stars</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Review Text</label>
                <textarea
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingReview(null);
                    setFormData({ customerName: '', rating: 5, reviewText: '' });
                  }}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  {editingReview ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
