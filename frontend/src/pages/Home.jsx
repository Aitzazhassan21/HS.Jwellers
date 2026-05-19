import { useEffect, useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Check, ChevronRight, Heart, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// useCart not required on Home page currently
import { categoryAPI } from "../services/api.js";
import formatPKR from "../utils/formatPKR.js";
import hero from "../assets/hero/hero.jpg";
import hero1 from "../assets/hero/hero1.jpg";
import hero2 from "../assets/hero/hero2.jpg";
import hero3 from "../assets/hero/hero3.jpg";
import hero4 from "../assets/hero/hero4.jpg";
import hero5 from "../assets/hero/hero5.jpg";
import hero6 from "../assets/hero/hero6.jpg";
import { getProductImage, getCategoryImage } from "../utils/imageHelpers.js";

// Static category config for image paths and taglines
const CATEGORY_CONFIG = {
  'necklace-and-chain': { folder: 'neck', prefix: 'neck', count: 11, startIdx: 1, tagline: 'Statement pieces for every neckline' },
  rings: { folder: 'ring', prefix: 'ring', count: 10, startIdx: 1, tagline: 'Stackable & statement rings' },
  earrings: { folder: 'earing', prefix: 'earring', count: 9, startIdx: 1, tagline: 'From subtle studs to bold drops' },
  bracelets: { folder: 'braclet', prefix: 'beaclet', count: 11, startIdx: 1, tagline: 'Wrist candy & elegant timepieces' },
  anklets: { folder: 'anklet', prefix: 'anklet', count: 11, startIdx: 1, tagline: 'Delicate chains for graceful steps' },
  sale: { folder: 'deal', prefix: 'dealsale', count: 5, startIdx: 1, tagline: 'Limited time offers — grab fast!' },
};

// Category lists removed — not used on this page

const LIVE_REVIEWS = [
  {
    id: 1,
    name: "Fatima Ahmed",
    location: "Karachi",
    initials: "FA",
    rating: 5,
    review: "Absolutely stunning pieces! The quality exceeded my expectations.",
    timeAgo: "Just now",
    verified: true,
  },
  {
    id: 2,
    name: "Zainab Khan",
    location: "Lahore",
    initials: "ZK",
    rating: 5,
    review: "Perfect for my wedding. The craftsmanship is incredible!",
    timeAgo: "2 mins ago",
    verified: true,
  },
  {
    id: 3,
    name: "Amira Hassan",
    location: "Islamabad",
    initials: "AH",
    rating: 5,
    review: "Best artificial jewellery I've ever purchased. Highly recommend!",
    timeAgo: "5 mins ago",
    verified: true,
  },
  {
    id: 4,
    name: "Nida Malik",
    location: "Rawalpindi",
    initials: "NM",
    rating: 5,
    review: "Amazing customer service and fast shipping. Very satisfied!",
    timeAgo: "8 mins ago",
    verified: true,
  },
  {
    id: 5,
    name: "Hira Ali",
    location: "Multan",
    initials: "HA",
    rating: 5,
    review: "Beautiful designs at affordable prices. Will order again!",
    timeAgo: "12 mins ago",
    verified: true,
  },
  {
    id: 6,
    name: "Sara Hussain",
    location: "Faisalabad",
    initials: "SH",
    rating: 5,
    review: "Premium quality with attention to detail. Worth every penny.",
    timeAgo: "15 mins ago",
    verified: true,
  },
  {
    id: 7,
    name: "Aqsa Naveed",
    location: "Peshawar",
    initials: "AN",
    rating: 5,
    review: "Elegant pieces perfect for any occasion. Loved it!",
    timeAgo: "18 mins ago",
    verified: true,
  },
  {
    id: 8,
    name: "Mina Rashid",
    location: "Quetta",
    initials: "MR",
    rating: 5,
    review: "Outstanding quality and reliable service. Highly recommended!",
    timeAgo: "22 mins ago",
    verified: true,
  },
];

const sectionTitleClass = "font-playfair text-[30px] sm:text-[32px] font-bold text-text-dark";

const HERO_SLIDER_IMAGES = [
  hero,
  hero1,
  hero2,
  hero3,
  hero4,
  hero5,
  hero6,
];

// fallback images intentionally omitted; hero set used where needed

const buildCategoryImages = (slug, coverImage, count = 6) => {
  const config = CATEGORY_CONFIG[slug];
  const images = [];

  if (config) {
    for (let i = 0; i < Math.min(count, config.count); i += 1) {
      images.push(`/assets/${config.folder}/${config.prefix}${config.startIdx + i}.jpg`);
    }
  }

  if (coverImage && typeof coverImage === 'string' && !images.includes(coverImage)) {
    images.unshift(coverImage);
  }

  if (images.length === 0) {
    return [hero, hero1, hero2, hero3, hero4, hero5].slice(0, count);
  }

  return images.slice(0, count);
};

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDER_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDER_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDER_IMAGES.length) % HERO_SLIDER_IMAGES.length);
  };

  const words = "Elegance in Every Detail".split(" ");

  return (
    <div className="relative w-full h-[85vh] sm:h-[90vh] lg:h-screen overflow-hidden bg-[#1A1A2E]">
      {HERO_SLIDER_IMAGES.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={img}
            alt={`Hero ${index + 1}`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-[#1A1A2E]/60 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-[700px]">
            {/* Floating Badge */}
            <div className="inline-block mb-4 sm:mb-6 animate-on-scroll">
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#debc65] to-[#C9A84C] px-4 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-semibold text-black font-playfair pulse-glow">
                ✦ Official 2026 Artificial Jewellery Sale On
              </span>
            </div>

            {/* Gold Accent Line */}
            <div className="gold-accent-line mb-4 sm:mb-6"></div>

            {/* Animated Headline */}
            <h1 className="font-playfair text-[32px] sm:text-[48px] lg:text-[72px] font-bold leading-tight text-white mb-4">
              {words.map((word, index) => (
                <span key={index} className="word-animate inline-block" style={{ animationDelay: `${index * 0.1}s` }}>
                  {word}{" "}
                  {word === "Detail" && <em className="italic text-[#debc65]">Detail</em>}
                </span>
              ))}
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base lg:text-lg text-[#debc65]/80 italic font-playfair animate-on-scroll" style={{ animationDelay: '0.8s' }}>
              Discover our exquisite collection of handcrafted artificial jewellery
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 animate-on-scroll" style={{ animationDelay: '1s' }}>
              <Link
                to="/collection"
                className="shimmer-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#debc65] to-[#C9A84C] px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold text-black hover:scale-105 transition-all shadow-[#debc65]/30"
              >
                Shop Now
                <ChevronRight size={16} />
              </Link>
              <Link
                to="/collection"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#debc65] px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold text-[#debc65] hover:bg-[#debc65] hover:text-black transition-all"
              >
                View Collection
              </Link>
            </div>

            {/* Trust Bar */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-x-4 sm:gap-x-8 gap-y-2 text-xs sm:text-sm text-gray-200 animate-on-scroll" style={{ animationDelay: '1.2s' }}>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#debc65]" />
                Free Delivery
              </span>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#debc65]" />
                Easy Returns
              </span>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#debc65]" />
                Premium Quality
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#1A1A2E]/80 backdrop-blur-sm text-[#debc65] border border-[#debc65]/30 hover:bg-[#debc65] hover:text-black transition-all hover:scale-110"
      >
        <ArrowLeft size={20} />
  </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#1A1A2E]/80 backdrop-blur-sm text-[#debc65] border border-[#debc65]/30 hover:bg-[#debc65] hover:text-black transition-all hover:scale-110"
      >
        <ArrowRight size={20} />
      </button>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDER_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-6 sm:w-8 bg-[#debc65]' : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const CategorySliderRow = ({ category, images, direction, index }) => {
  const scrollRef = useRef(null);
  const categoryName = category.name || category.slug || 'Category';
  const categoryRoute = category.route || `/category/${category.slug || category.name}`;

  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const sliderImages = validImages.length > 0
    ? validImages
    : buildCategoryImages(category.slug, category.coverImage, CATEGORY_CONFIG[category.slug]?.count || 6);
  const duplicatedImages = [...sliderImages, ...sliderImages];
  const animationDuration = `${Math.max(20, sliderImages.length * 5)}s`;

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12 sm:mb-16 animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="flex items-center justify-between mb-6 sm:mb-8 px-4">
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-[#debc65] to-[#C9A84C] rounded-full"></div>
          <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#1A1A1A]">{categoryName}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-400)}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#1A1A2E] text-[#debc65] border border-[#debc65]/30 hover:bg-[#debc65] hover:text-black transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => scroll(400)}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#1A1A2E] text-[#debc65] border border-[#debc65]/30 hover:bg-[#debc65] hover:text-black transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-[#FFFCF5] p-1 shadow-xl">
        <div
          ref={scrollRef}
          className={`infinite-scroll-container overflow-x-auto scrollbar-hide`}
          style={{ animation: `${direction === 'left' ? 'slideLeft' : 'slideRight'} ${animationDuration} linear infinite` }}
        >
          {duplicatedImages.map((img, idx) => (
            <Link
              key={`${categoryName}-${idx}`}
              to={categoryRoute}
              className="flex-shrink-0 min-w-[180px] sm:min-w-[220px] h-[260px] sm:h-[320px] rounded-2xl overflow-hidden group relative shadow-lg card-hover-lift border border-[#debc65]/20 hover:border-[#debc65]"
            >
              <div className="image-zoom w-full h-full overflow-hidden">
                <img
                  src={img}
                  alt={`${categoryName} ${idx + 1}`}
                  className="w-full h-full object-cover transform scale-[1.08] transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 sm:p-5">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-white font-semibold text-sm sm:text-lg">View Collection</span>
                  <div className="mt-2 h-0.5 w-0 group-hover:w-full bg-[#debc65] transition-all duration-500"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-[#FFFCF5]/90 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-[#FFFCF5]/90 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

CategorySliderRow.propTypes = {
  category: PropTypes.object.isRequired,
  images: PropTypes.array,
  direction: PropTypes.oneOf(['left', 'right']),
  index: PropTypes.number,
};

const getStars = (ratingValue) => {
  const value = Number(ratingValue) || 0;
  return Array.from({ length: 5 }, (_, index) => index < Math.round(value));
};

const ProductCard = ({ product, onAdd, index }) => {
  const price = product?.discountPrice || product?.price || 0;
  const originalPrice = product?.price || 0;
  const rating = product?.ratings?.average || product?.averageRating || 0;
  const ratingCount = product?.ratings?.count || product?.reviewCount || product?.reviews?.length || 0;
  const stars = getStars(rating);
  const imageUrl = getProductImage(product);

  return (
    <div className="group rounded-2xl border border-[#debc65]/20 bg-white p-2 sm:p-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(222,188,101,0.2)] animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
      <Link to={`/product/${product?._id || ""}`} className="relative block overflow-hidden rounded-xl bg-[#FFFCF5] image-zoom">
        <div className="h-[220px] sm:h-[260px] w-full overflow-hidden rounded-xl bg-[#FFFCF5]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product?.name || "Product"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-text-muted">Image Placeholder</div>
          )}
        </div>

        {product?.isNewArrival && (
          <span className="absolute left-2 sm:left-3 top-2 sm:top-3 rounded-full bg-[#1A1A2E] px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-[#debc65]">
            New
          </span>
        )}

        <button
          type="button"
          className="absolute right-2 sm:right-3 top-2 sm:top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-text-dark transition-all duration-300 hover:scale-110 hover:text-[#debc65] opacity-0 group-hover:opacity-100"
        >
          <Heart size={15} />
        </button>
      </Link>

      <div className="pt-3 sm:pt-4">
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[1.2px] text-[#debc65]">{product?.category?.name || "Jewellery"}</p>
        <Link
          to={`/product/${product?._id || ""}`}
          className="mt-1 line-clamp-2 min-h-[36px] sm:min-h-[40px] text-[13px] sm:text-[15px] font-medium leading-5 text-[#1A1A1A] group-hover:text-[#debc65] transition-colors"
        >
          {product?.name || "Premium Jewellery Piece"}
        </Link>

        <div className="mt-2 flex items-center gap-1.5">
          {stars.map((filled, idx) => (
            <Star
              key={idx}
              size={12}
              className={filled ? "fill-[#debc65] text-[#debc65]" : "text-[#D3D3D3]"}
            />
          ))}
          <span className="ml-1 text-[10px] sm:text-xs text-text-muted">({ratingCount})</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm sm:text-base font-semibold text-[#debc65]">{formatPKR(price)}</span>
          {originalPrice > price && (
            <span className="text-xs sm:text-sm text-text-muted line-through">{formatPKR(originalPrice)}</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAdd(product)}
          className="mt-3 sm:mt-4 w-full rounded-full bg-[#1A1A2E] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-[#debc65] transition-all duration-300 hover:bg-[#debc65] hover:text-black btn-slide-up"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    discountPrice: PropTypes.number,
    isNewArrival: PropTypes.bool,
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      })
    ),
    ratings: PropTypes.shape({
      average: PropTypes.number,
      count: PropTypes.number,
    }),
    averageRating: PropTypes.number,
    reviewCount: PropTypes.number,
    reviews: PropTypes.array,
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
  index: PropTypes.number,
};

const AnnouncementBar = () => {
  return (
    <div className="marquee-container bg-[#1A1A2E] overflow-hidden py-3">
      <div className="marquee-content whitespace-nowrap flex gap-8">
        <span className="text-[#debc65] text-sm font-inter">
          ✦ Official 2026 Artificial Jewellery Sale On — premium designs at exclusive prices
        </span>
        <span className="text-[#debc65] text-sm font-inter">
          ✦ Free delivery on orders above Rs.2000
        </span>
        <span className="text-[#debc65] text-sm font-inter">
          ✦ Limited-time collection — shop now before it sells out
        </span>
        <span className="text-[#debc65] text-sm font-inter">
          ✦ Authentic styling with luxury-inspired finishing
        </span>
        <span className="text-[#debc65] text-sm font-inter">
          ✦ Official 2026 Artificial Jewellery Sale On — premium designs at exclusive prices
        </span>
        <span className="text-[#debc65] text-sm font-inter">
          ✦ Free delivery on orders above Rs.2000
        </span>
        <span className="text-[#debc65] text-sm font-inter">
          ✦ Limited-time collection — shop now before it sells out
        </span>
        <span className="text-[#debc65] text-sm font-inter">
          ✦ Authentic styling with luxury-inspired finishing
        </span>
      </div>
    </div>
  );
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubscribing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://hsjewelsapi.vercel.app'}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        setNewsletterEmail('');
      } else {
        toast.error(data.message || 'Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        const apiCategories = response.data?.categories || response.data?.data?.categories || response.data?.data || response.data || [];

        const mappedCategories = apiCategories.map((cat) => {
          const config = CATEGORY_CONFIG[cat.slug] || { tagline: 'Beautiful jewellery' };
          const coverImage = getCategoryImage(cat?.image || cat) || hero;
          return {
            name: cat.name || cat.slug || 'Category',
            route: `/category/${cat.slug}`,
            coverImage,
            tagline: config.tagline,
            slug: cat.slug,
            _id: cat._id || cat.slug,
          };
        });

        setCategories(mappedCategories);
      } catch (error) {
        console.error('Load categories failed:', error);
        toast.error('Unable to load categories');
        setCategoryError(true);

        const fallbackCategories = Object.keys(CATEGORY_CONFIG).map((slug) => {
          const config = CATEGORY_CONFIG[slug];
          return {
            name: slug.charAt(0).toUpperCase() + slug.slice(1),
            route: `/category/${slug}`,
            coverImage: `/assets/${config.folder}/${config.prefix}${config.startIdx}.jpg`,
            tagline: config.tagline,
            slug,
            _id: slug,
          };
        });
        setCategories(fallbackCategories);
      }
    };

    loadCategories();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe any animate-on-scroll elements present now (or added after categories load)
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      // Unobserve the same elements we observed and disconnect the observer
      animatedElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [categories]);

  // Auto-scroll to categories section when categories are loaded
  useEffect(() => {
    if (!categories || categories.length === 0) return;
    const el = document.getElementById('categories-section');
    if (el) {
      setTimeout(() => {
        try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch { /* ignore */ }
      }, 120);
    }
  }, [categories]);

  // Generate CATEGORY_SLIDER_IMAGES dynamically from categories
  const CATEGORY_SLIDER_IMAGES = useMemo(() => {
    const images = {};
    categories.forEach((cat) => {
      images[cat.slug] = buildCategoryImages(cat.slug, cat.coverImage, 6);
    });
    return images;
  }, [categories]);

  // Using addToCartAction directly where needed; helper removed to avoid unused warning

  return (
    <div>
      <AnnouncementBar />
      <HeroSlider />

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:py-14 lg:py-16 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 animate-on-scroll">
          <h2 className={`${sectionTitleClass}`}>Shop by Category</h2>
          <p className="mt-2 text-sm sm:text-base text-text-muted">Explore our collections</p>
          {categoryError && (
            <p className="mt-3 text-sm text-primary">Unable to load live categories. Showing default choices.</p>
          )}
        </div>

        <div className="space-y-8">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <CategorySliderRow
                key={category.name || category.slug || index}
                category={category}
                images={CATEGORY_SLIDER_IMAGES[category.slug] || [hero, hero1, hero2]}
                direction={index % 2 === 0 ? 'left' : 'right'}
                index={index}
              />
            ))
          ) : (
            <div className="text-center py-12 text-text-muted">
              <p>Loading categories...</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 lg:py-20 lg:px-8">
        <div className="text-center mb-14 animate-fade-in-up">
          <h2 className={`${sectionTitleClass}`}>Gallery Wall</h2>
          <p className="mt-3 text-sm sm:text-base text-text-muted font-light">Curated luxury moments</p>
          <div className="mt-4 h-1 w-12 bg-gradient-to-r from-[#debc65] to-[#C9A84C] rounded-full mx-auto"></div>
        </div>

        <div className="gallery-masonry-grid">
          {categories.map((category, index) => {
            const categoryName = category.name || category.slug;
            const categoryRoute = category.route;
            const rawImages = CATEGORY_SLIDER_IMAGES[category.slug] || [hero, hero1];
            const uniqueImages = Array.from(new Set(rawImages)).filter(Boolean);
            const galleryImage = uniqueImages[0] || hero;
            
            // Vary heights for masonry effect: small, regular, tall, small, regular
            const heightClasses = ['gallery-card-sm', 'gallery-card-md', 'gallery-card-lg', 'gallery-card-sm', 'gallery-card-md'];
            const cardHeight = heightClasses[index % 5];

            return (
              <Link 
                key={categoryName} 
                to={categoryRoute} 
                className={`gallery-card-container group ${cardHeight} animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="gallery-card-small">
                  <div className="gallery-card-blur-bg"></div>
                  <img
                    src={galleryImage}
                    alt={categoryName}
                    className="gallery-card-image"
                  />
                  <div className="gallery-card-overlay">
                    <div className="gallery-card-label">
                      <span className="gallery-label-text">{categoryName}</span>
                      <div className="gallery-label-underline"></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:py-16 lg:py-18 lg:px-8">
        <div className="rounded-3xl border border-[#debc65]/15 bg-[#1A1A2E] p-8 shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-[#debc65] mb-4">Official 2026 Artificial Jewellery Sale</p>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">Antique Timeline & Design Journey</h2>
              <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                Discover the evolution of artificial jewellery design, from heritage-inspired classics to bold modern creations.
                Explore how the 2026 collection blends tradition with contemporary style.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/antique-timeline"
                className="inline-flex items-center justify-center rounded-full bg-[#debc65] px-6 py-3 text-sm font-semibold text-black hover:bg-[#C9A84C] transition-all"
              >
                Explore Timeline
              </Link>
              <Link
                to="/collection"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-black transition-all"
              >
                Shop the Sale
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-2 sm:mt-4 max-w-[1400px] px-4 py-10 sm:py-12 lg:py-14 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 animate-on-scroll">
          <h2 className={`${sectionTitleClass}`}>Exclusive Deals</h2>
          <p className="mt-2 text-sm sm:text-base text-text-muted">Pair up and save more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#debc65] to-[#c9a84c] p-8 shadow-2xl animate-fade-in-up">
            <div className="absolute top-4 right-4 bg-black text-[#debc65] px-4 py-2 rounded-full text-sm font-inter shadow-lg animate-pulse-glow">
              40% OFF
            </div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="flex-1">
                <h3 className="font-playfair text-2xl font-bold text-black mb-2">Necklace & Earrings Set</h3>
                <p className="text-black/90 text-sm mb-4">Perfect combo for everyday elegance</p>
                <div className="flex items-center gap-3">
                  <span className="text-black text-2xl font-bold">Rs 4,500</span>
                  <span className="text-black/70 line-through">Rs 7,500</span>
                </div>
                <Link
                  to="/collection"
                  className="mt-6 inline-flex items-center gap-2 bg-black text-[#debc65] px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-all"
                >
                  Shop Now
                  <ChevronRight size={18} />
                </Link>
              </div>
              <div className="w-32 h-32 bg-black/20 rounded-2xl flex items-center justify-center">
                <span className="text-6xl">📿✨</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-black to-[#1A1A1A] p-8 shadow-2xl animate-fade-in-up delay-100">
            <div className="absolute top-4 right-4 bg-[#debc65] text-black px-4 py-2 rounded-full text-sm font-inter shadow-lg animate-pulse-glow">
              35% OFF
            </div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="flex-1">
                <h3 className="font-playfair text-2xl font-bold text-white mb-2">Bridal Combo Set</h3>
                <p className="text-white/80 text-sm mb-4">Complete bridal jewellery collection</p>
                <div className="flex items-center gap-3">
                  <span className="text-white text-2xl font-bold">Rs 12,000</span>
                  <span className="text-white/70 line-through">Rs 18,500</span>
                </div>
                <Link
                  to="/category/bridal"
                  className="mt-6 inline-flex items-center gap-2 bg-[#debc65] text-black px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-all"
                >
                  Shop Now
                  <ChevronRight size={18} />
                </Link>
              </div>
              <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center">
                <span className="text-6xl">👰💍</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-[#FFFCF5] py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-on-scroll">
            <h2 className={`${sectionTitleClass}`}>Why Choose Us</h2>
            <p className="mt-2 text-sm sm:text-base text-text-muted">Experience the difference with our premium service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "✦", title: "Premium Quality", desc: "Handcrafted with attention to detail" },
              { icon: "✦", title: "Fast Delivery", desc: "Quick and reliable shipping nationwide" },
              { icon: "✦", title: "Easy Returns", desc: "Hassle-free 7-day return policy" },
              { icon: "✦", title: "24/7 Support", desc: "Dedicated customer service team" },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-transparent bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#debc65] animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1A2E] text-[#debc65] text-2xl mb-4">
                  {item.icon}
                </div>
                <h3 className="font-playfair text-lg font-semibold text-[#1A1A1A] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 font-inter">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#1A1A2E] via-[#0F1419] to-[#000000] py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#debc65]/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#C9A84C]/8 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>

        <div className="mx-auto max-w-[1400px] px-4 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-14 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-[#debc65]/10 to-[#C9A84C]/10 border border-[#debc65]/30">
              <span className="w-2 h-2 rounded-full bg-[#debc65] animate-pulse"></span>
              <span className="text-xs font-semibold text-[#debc65] tracking-wide">LIVE CUSTOMER FEED</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">What Our Customers Say</h2>
            <p className="text-sm sm:text-base text-gray-300 font-light">Real reviews from real customers — trusted by jewellery lovers across Pakistan</p>
          </div>

          <div className="relative">
            {/* Live reviews ticker */}
            <div className="live-reviews-container">
              <div className="live-reviews-ticker">
                {/* First row - scrolling left */}
                <div className="live-reviews-row">
                  {[...LIVE_REVIEWS, ...LIVE_REVIEWS].map((review, idx) => (
                    <div key={`left-${review.id}-${Math.floor(idx / LIVE_REVIEWS.length)}`} className="live-review-card">
                      <div className="live-card-glow"></div>
                      <div className="live-card-content">
                        <div className="live-card-header">
                          <div className="live-avatar">
                            <span>{review.initials}</span>
                          </div>
                          <div className="live-card-info">
                            <div className="live-card-name-row">
                              <span className="live-card-name">{review.name}</span>
                              {review.verified && (
                                <span className="live-verified-badge">✓ Verified</span>
                              )}
                            </div>
                            <span className="live-card-location">{review.location}</span>
                          </div>
                          <span className="live-card-time">{review.timeAgo}</span>
                        </div>
                        <div className="live-card-rating">
                          {new Array(review.rating).fill(null).map((_, i) => (
                            <span key={`star-${review.id}-${i}`} className="live-star">★</span>
                          ))}
                        </div>
                        <p className="live-card-review">{review.review}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Second row - scrolling right */}
                <div className="live-reviews-row live-reviews-row-reverse">
                  {[...LIVE_REVIEWS.slice().reverse(), ...LIVE_REVIEWS.slice().reverse()].map((review, idx) => (
                    <div key={`right-${review.id}-${Math.floor(idx / LIVE_REVIEWS.length)}`} className="live-review-card" style={{ animationDelay: `${(idx * 0.05)}s` }}>
                      <div className="live-card-glow"></div>
                      <div className="live-card-content">
                        <div className="live-card-header">
                          <div className="live-avatar">
                            <span>{review.initials}</span>
                          </div>
                          <div className="live-card-info">
                            <div className="live-card-name-row">
                              <span className="live-card-name">{review.name}</span>
                              {review.verified && (
                                <span className="live-verified-badge">✓ Verified</span>
                              )}
                            </div>
                            <span className="live-card-location">{review.location}</span>
                          </div>
                          <span className="live-card-time">{review.timeAgo}</span>
                        </div>
                        <div className="live-card-rating">
                          {new Array(review.rating).fill(null).map((_, i) => (
                            <span key={`star-${review.id}-${i}`} className="live-star">★</span>
                          ))}
                        </div>
                        <p className="live-card-review">{review.review}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient overlays */}
              <div className="live-reviews-fade-left"></div>
              <div className="live-reviews-fade-right"></div>
            </div>

            {/* Trust indicator */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[#debc65] font-playfair">500+</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">5-Star Reviews</p>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#debc65]/30 to-transparent"></div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[#debc65] font-playfair">10K+</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">Happy Customers</p>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#debc65]/30 to-transparent"></div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[#debc65] font-playfair">98%</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#1A1A2E] to-[#000000] py-10 sm:py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-[#debc65]/20 text-4xl sm:text-6xl float-diamond">◆</div>
        <div className="absolute bottom-10 right-10 text-[#debc65]/20 text-3xl sm:text-4xl float-diamond" style={{ animationDelay: '2s' }}>◆</div>
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center animate-on-scroll">
            <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay Updated with <span className="text-[#debc65]">Exclusive Offers</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 font-inter">
              Subscribe to our newsletter and be the first to know about new arrivals, special offers, and exclusive discounts.
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 rounded-full bg-white/10 border border-[#debc65]/40 px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#debc65] font-inter"
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="bg-[#debc65] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#C9A84C] transition-colors font-inter disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
