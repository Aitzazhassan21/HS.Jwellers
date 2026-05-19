import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col justify-around gap-12 py-8 text-xs text-center text-gray-700 sm:flex-row sm:gap-2 sm:text-sm md:text-base'>
        <div>
            <img src={assets.exchange_icon} className='w-12 m-auto mb-3' alt="Fast UK Dispatch" />
            <p className='mb-2 font-semibold'>Fast UK Dispatch</p>
            <p className='text-gray-400'>
                In-house Manchester lab for quick turnaround.
            </p>
        </div>
        <div>
            <img src={assets.quality_icon} className='w-12 m-auto mb-3' alt="100% Genuine Frames" />
            <p className='mb-2 font-semibold'>100% Genuine Frames</p>
            <p className='text-gray-400'>
                Authentic designer and kids frames guaranteed.
            </p>
        </div>
        <div>
            <img src={assets.support_img} className='w-12 m-auto mb-3' alt="UK Based Support" />
            <p className='mb-2 font-semibold'>UK Based Support</p>
            <p className='text-gray-400'>
                Friendly help via email, phone, or chat.
            </p>
        </div>
    </div>
  )
}

export default OurPolicy
