import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FaqsSection = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'What types of eyewear do you offer?',
      answer: 'We offer a wide range of eyewear including prescription glasses, sunglasses, reading glasses, and blue light blocking glasses.'
    },
    {
      id: 2,
      question: 'Do you offer prescription lenses?',
      answer: 'Yes, we offer prescription lenses including single vision, bifocals, and progressive lenses with various coatings.'
    },
    {
      id: 3,
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all unworn frames. Full refund or exchange available.'
    },
    {
      id: 4,
      question: 'Do you accept vision insurance?',
      answer: 'Yes, we accept most major vision insurance plans and offer flexible payment options.'
    },
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className='mb-20'>
      <div className='text-center mb-12'>
        <h2 className='text-4xl font-black text-slate-900 mb-4'>
          Frequently Asked <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>Questions</span>
        </h2>
        <p className='text-slate-500'>Find answers to common questions</p>
      </div>
      <div className='max-w-4xl mx-auto'>
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

export default FaqsSection;
