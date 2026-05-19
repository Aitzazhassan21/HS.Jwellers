import React from 'react';
import { MoveRight, Star, ShieldCheck, ShoppingBag } from 'lucide-react';
import { assets } from '../assets/assets';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-white flex items-center overflow-hidden pt-20">
      
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 skew-x-[-12deg] translate-x-20 hidden lg:block"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>

      <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="order-2 lg:order-1 space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-blue-50 px-5 py-2 rounded-full border border-blue-100">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">Collection 2026</span>
            </div>

            <h1 className="text-6xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              EYEWEAR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">REDEFINED.</span>
            </h1>

            <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-light">
              Experience the perfect blend of Italian craftsmanship and modern technology. Our frames don't just help you see—they help you <span className="font-semibold text-slate-800 underline decoration-blue-500 underline-offset-4">be seen.</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <button className="group relative px-10 py-5 bg-slate-900 text-white rounded-xl font-bold overflow-hidden transition-all hover:pr-14">
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingBag size={20} />
                Shop The Look
              </span>
              <MoveRight className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300" size={20} />
            </button>
            
            <button className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
              Virtual Try-On
            </button>
          </div>

          {/* Luxury Proof Labels */}
          <div className="flex gap-12 pt-10 border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-900">99%</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">UV Protection</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-900">Lifetime</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Warranty</span>
            </div>
          </div>
        </div>

        {/* Right Content - The "Showpiece" Image */}
        <div className="order-1 lg:order-2 relative flex justify-center">
          <div className="relative group">
            
            {/* Main Image Wrapper */}
            <div className="relative w-[320px] h-[450px] md:w-[450px] md:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 transform group-hover:scale-[1.02] group-hover:-rotate-2 rotate-2 border-8 border-white">
              <img
                src={assets.hero_img}
                alt="Luxury Eyewear"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -top-6 -right-6 md:-right-12 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 z-20 animate-bounce transition-all duration-1000" style={{ animationDuration: '3s' }}>
              <div className="bg-green-100 p-2 rounded-full w-fit mb-2">
                <ShieldCheck size={20} className="text-green-600" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Quality Guaranteed</p>
              <p className="text-sm font-black text-slate-900">Certified Premium</p>
            </div>

            {/* Product Tag */}
            <div className="absolute bottom-10 -left-10 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl z-20 hidden md:block">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="#FACC15" className="text-yellow-400" />
                ))}
              </div>
              <p className="text-xs font-medium text-slate-400">Bestseller of the month</p>
              <p className="text-lg font-bold italic">The Noir Series</p>
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-200/40 to-purple-200/20 rounded-full -z-10 blur-3xl"></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
