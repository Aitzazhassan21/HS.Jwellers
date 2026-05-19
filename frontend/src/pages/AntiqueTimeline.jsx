import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const timelineSteps = [
  {
    year: "1990",
    title: "Heritage Inspiration",
    description: "Classic necklace and earring sets inspired by traditional craftsmanship and royal occasions.",
  },
  {
    year: "2005",
    title: "Bold Statement Pieces",
    description: "Artificial jewellery moved beyond ordinary designs with bold, fashion-forward silhouettes.",
  },
  {
    year: "2016",
    title: "Modern Fusion",
    description: "Minimalist meets luxe: lightweight pieces with premium finishes for everyday elegance.",
  },
  {
    year: "2024",
    title: "Designer Revival",
    description: "Curated collections blend antique motifs with contemporary style for 2026-ready looks.",
  },
];

const AntiqueTimeline = () => {
  return (
    <div className="min-h-screen bg-[#FFFCF5] pt-[90px] pb-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.4em] text-[#debc65] mb-3">Antique Timeline</p>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
            The Journey of Artificial Jewellery Design
          </h1>
          <p className="mx-auto max-w-3xl text-base sm:text-lg text-[#4B5563]">
            Explore the rich design story behind our unique jewellery, from antique-inspired heirlooms to the official 2026 sale collection.
          </p>
        </div>

        <div className="space-y-10">
          {timelineSteps.map((step, index) => (
            <div key={step.year} className="relative rounded-3xl border border-[#debc65]/15 bg-white p-8 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-[#debc65] to-transparent" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#debc65] mb-2">{step.year}</p>
                  <h2 className="font-playfair text-2xl font-bold text-[#1A1A1A]">
                    {step.title}
                  </h2>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#F7EFE2] px-4 py-2 text-sm font-medium text-[#1A1A1A]">
                  Step {index + 1}
                </span>
              </div>
              <p className="mt-6 text-sm leading-7 text-[#4B5563]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-[#1A1A2E] p-10 text-white shadow-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#debc65] mb-4">Official Sale Highlight</p>
            <h3 className="font-playfair text-3xl font-bold mb-4">Sale 2026: Artificial Jewellery On</h3>
            <p className="text-sm text-white/80 leading-7">
              Discover premium artificial jewellery styles with official sale offers and heritage-inspired finishing. Perfect for celebrations, gifting, and everyday glamour.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-10 shadow-xl border border-[#debc65]/10">
            <h3 className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-4">Shop the Collection</h3>
            <p className="text-sm text-[#4B5563] leading-7 mb-6">
              Browse our official sale range and choose from necklaces, rings, earrings, bracelets, and anklets designed for modern style.
            </p>
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 rounded-full bg-[#debc65] px-6 py-3 text-sm font-semibold text-black hover:bg-[#C9A84C] transition-all"
            >
              View Sale Collection
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AntiqueTimeline;
