import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';
import { getApiBaseUrl } from '../utils/apiConfig.js';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([
    { _id: 'm1', customerName: 'Amjad', rating: 5, reviewText: 'Amazing quality lenses and great service. Highly recommend. Will be back for a second pair.', date: new Date() },
    { _id: 'm2', customerName: 'Karen Davies', rating: 5, reviewText: 'Received my order about 10 days ago... The lenses are the best I\'ve had ever compared to the shops.', date: new Date() },
    { _id: 'm3', customerName: 'Peter', rating: 5, reviewText: 'Faz went above and beyond to help us... Broken on Friday night and we were able to collect on Saturday.', date: new Date() },
    { _id: 'm4', customerName: 'Mark T', rating: 5, reviewText: 'Great frame, solid quality and speedy service. Varifocals are spot on too.', date: new Date() },
    { _id: 'm5', customerName: 'Robin', rating: 5, reviewText: 'The frame was perfect. I wasn\'t able to get Batman frames from anywhere else but these guys had so many options.', date: new Date() },
    { _id: 'm6', customerName: 'Emma Baxter', rating: 5, reviewText: 'Good quality. Comfortable fit, Great value for money and quick delivery.', date: new Date() },
    { _id: 'm7', customerName: 'Sam H', rating: 5, reviewText: 'I loved how interactive they were... the packaging was cute, there was even a few sweets in there.', date: new Date() },
    { _id: 'm8', customerName: 'Melissa', rating: 5, reviewText: 'Better than my high street pair. So much cheaper and I think the quality is actually better.', date: new Date() },
    { _id: 'm9', customerName: 'Ella J', rating: 5, reviewText: 'Couldn\'t be happier ordered yesterday and arrived today and I can finally see!!', date: new Date() },
    { _id: 'm10', customerName: 'Sonja', rating: 5, reviewText: 'Can\'t fault them. Service was great. Glasses are great. Lenses are spot on and the delivery was fast.', date: new Date() },
    { _id: 'm11', customerName: 'Jonny', rating: 5, reviewText: 'Thanks for your help! Good communication and my son loves the frames.', date: new Date() },
    { _id: 'm12', customerName: 'Anonymous', rating: 5, reviewText: 'Very well packed glasses. Attractively presented. Would reorder.', date: new Date() },
  ]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/reviews`);
        if (response.data.success && response.data.reviews.length > 0) {
          setReviews(response.data.reviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

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

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10"></div>
          <span className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">147 happy customers</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Let customers speak for us — 5.0 out of 5 stars based on 147 reviews. Real stories from our Manchester lab to your doorstep.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {reviews.slice(0, 3).map((review, index) => (
            <div 
              key={review._id} 
              className="group relative bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {/* Decorative Quote Mark */}
              <div className="absolute -top-4 -right-2 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V5C14.017 3.89543 14.9124 3 16.017 3H19.017C21.2261 3 23.017 4.79086 23.017 7V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91239 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H5.017C3.91239 8 3.017 7.10457 3.017 6V5C3.017 3.89543 3.91239 3 5.017 3H8.017C10.2261 3 12.017 4.79086 12.017 7V15C12.017 18.3137 9.33071 21 6.017 21H3.017Z" />
                </svg>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-6">
                {renderStars(review.rating)}
              </div>

              {/* Review Text */}
              <div className="relative z-10">
                <p className="text-slate-700 text-lg leading-relaxed mb-8 italic">
                  "{review.reviewText}"
                </p>
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {review.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {review.customerName}
                  </p>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Verified Purchase
                  </p>
                </div>
              </div>

              {/* Bottom Accent Bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
