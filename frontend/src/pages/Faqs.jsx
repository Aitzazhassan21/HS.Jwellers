import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';

const Faqs = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'What types of eyewear do you offer?',
      answer: 'We offer a comprehensive selection of premium eyewear, including handcrafted acetate frames, lightweight titanium models, and designer sunglasses. Our range covers prescription glasses, blue light filters, reading glasses, and high-performance sports eyewear for men, women, and children.'
    },
    {
      id: 2,
      question: 'Do you offer professional prescription lenses?',
      answer: 'Absolutely. We provide high-definition digital lenses tailored to your specific vision needs. Our options include single vision, advanced bifocals, and premium progressive (varifocal) lenses. All our lenses come with premium coatings like anti-glare, scratch-resistance, and 100% UV protection as standard.'
    },
    {
      id: 3,
      question: 'How do I submit my prescription?',
      answer: 'You can easily upload a photo of your prescription during the checkout process, or email it to us at prescriptions@optical.co.uk after placing your order. If you don\'t have it handy, we can even contact your optometrist on your behalf to obtain the necessary details.'
    },
    {
      id: 4,
      question: 'What is your return and satisfaction guarantee?',
      answer: 'We offer a "Love Your Glasses" 30-day satisfaction guarantee. If you\'re not completely happy with your frames, you can return them within 30 days for a full refund or exchange. For prescription lenses, if you have trouble adapting, we\'ll provide a one-time lens change at no extra cost within the first 30 days.'
    },
    {
      id: 5,
      question: 'Do you accept vision insurance or HSA/FSA?',
      answer: 'Yes, we are an out-of-network provider for most major vision insurance plans. We provide detailed itemized receipts that you can submit for reimbursement. We also accept all major HSA and FSA cards for prescription eyewear purchases.'
    },
    {
      id: 6,
      question: 'How long does delivery take for prescription orders?',
      answer: 'Quality takes precision. Standard prescription orders typically arrive within 7-10 business days. Complex prescriptions or specialized tinting may take up to 14 days. We provide end-to-end tracking so you can follow your new vision every step of the way.'
    },
    {
      id: 7,
      question: 'Can I try frames on before buying?',
      answer: 'We offer an advanced Virtual Try-On feature on our product pages, allowing you to see how any frame looks on your face using your camera. We also provide detailed frame measurements (lens width, bridge, temple length) to ensure you find the perfect fit based on your current glasses.'
    },
    {
      id: 8,
      question: 'What materials are your frames made from?',
      answer: 'We source only the finest materials. Our collection features premium Italian Mazzucchelli acetate, surgical-grade stainless steel, and ultra-lightweight Japanese titanium. These materials ensure your eyewear is not only stylish but also durable, hypoallergenic, and comfortable for all-day wear.'
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
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

  return (
    <div className='pt-10'>
      {/* Header */}
      <div className='text-center mb-16'>
        <h1 className='text-5xl md:text-6xl font-black text-slate-900 mb-4'>
          Frequently Asked <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>Questions</span>
        </h1>
        <p className='text-slate-500 text-lg max-w-2xl mx-auto'>
          Find answers to common questions about our eyewear, services, and policies
        </p>
      </div>

      {/* FAQs Section */}
      <div className='max-w-4xl mx-auto mb-20'>
        {faqs.map((faq) => (
          <div key={faq.id} className='mb-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>
            <button
              onClick={() => toggleFaq(faq.id)}
              className='w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors'
            >
              <span className='font-bold text-slate-900 text-lg pr-4'>{faq.question}</span>
              {openFaq === faq.id ? (
                <ChevronUp className='text-blue-600 flex-shrink-0' size={24} />
              ) : (
                <ChevronDown className='text-slate-400 flex-shrink-0' size={24} />
              )}
            </button>
            {openFaq === faq.id && (
              <div className='px-6 pb-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100'>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
