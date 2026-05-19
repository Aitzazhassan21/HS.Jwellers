import React from 'react';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-[#1A1A2E] overflow-hidden py-2">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex gap-8 text-xs font-medium text-white/90">
          <span>✨ Official 2026 Artificial Jewellery Sale On — Exclusive offers, fast delivery, and premium artificial jewellery collections. ✨</span>
          <span>✨ Official 2026 Artificial Jewellery Sale On — Exclusive offers, fast delivery, and premium artificial jewellery collections. ✨</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
