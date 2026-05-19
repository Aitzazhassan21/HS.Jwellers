import React from 'react'
import Title from '../components/Title'

const Reglazing = () => {
  return (
    <div className='px-4 sm:px-[2vw] md:px-[3vw] lg:px-[4vw] pt-8 pb-20'>
      <div className='text-center pt-8 text-2xl border-t'>
        <Title text1={'REGLAZING'} text2={'SERVICE'} />
      </div>
      <div className='max-w-3xl mx-auto mt-8 space-y-8 text-gray-600'>
        <p className='text-lg'>Save money by reglazing your own frames! At Sapphire Optics, our in-house Manchester lab can fit new prescription lenses into your existing frames — designer, vintage, or kids favourites.</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div className='border p-6 rounded-xl'>
            <h3 className='font-bold text-gray-800 mb-2'>Lens Types</h3>
            <ul className='space-y-1 text-sm'>
              <li>Single Vision</li>
              <li>Bifocal</li>
              <li>Varifocal</li>
            </ul>
          </div>
          <div className='border p-6 rounded-xl'>
            <h3 className='font-bold text-gray-800 mb-2'>Lens Thickness</h3>
            <ul className='space-y-1 text-sm'>
              <li>1.5 Standard</li>
              <li>1.6 Thin</li>
              <li>1.67 Thinner</li>
              <li>1.74 Ultra Thin</li>
            </ul>
          </div>
        </div>

        <div className='border p-6 rounded-xl'>
          <h3 className='font-bold text-gray-800 mb-3'>Lens Coatings</h3>
          <ul className='space-y-2 text-sm'>
            <li className='flex justify-between'><span>Anti-Reflection</span><span className='font-semibold'>+£15</span></li>
            <li className='flex justify-between'><span>Blue Light Protection</span><span className='font-semibold'>+£25</span></li>
            <li className='flex justify-between'><span>Reactions / Photochromic</span><span className='font-semibold'>+£45</span></li>
          </ul>
        </div>

        <p className='text-center text-sm text-gray-500'>Free UK delivery over £50 · 14-day money-back guarantee · In-house Manchester lab</p>
      </div>
    </div>
  )
}

export default Reglazing
