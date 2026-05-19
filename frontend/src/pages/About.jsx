import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div className='px-4 sm:px-[2vw] md:px-[3vw] lg:px-[4vw]'>
      <div className='pt-8 text-2xl text-center border-t'>
        <Title text1={'ABOUT'} text2={'SAPPHIRE OPTICS'} />
      </div>
      <div className='flex flex-col gap-16 my-10 md:flex-row'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="About Sapphire Optics" />
        <div className='flex flex-col justify-center gap-6 text-gray-600 md:w-2/4'>
          <p>Welcome to Sapphire Optics — your Manchester-based eyewear specialist. From prescription glasses and designer frames to specialist reglazing services, we're here to make clear vision accessible, affordable, and effortless. With an in-house lab right here in Manchester, we craft lenses with precision and dispatch them quickly across the UK.</p>
          <p>We stock a huge range of frames for men, women, kids, and unisex styles — including favourites like Batman, Harry Potter, and Justice League collections, plus designer brands such as Emporio Armani. Whether you need single vision, bifocals, varifocals, or reaction lenses, we've got you covered. Free UK delivery over £50 and a 14-day money-back guarantee come as standard.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>To deliver high-quality prescription eyewear at prices that beat the high street, without ever compromising on service. We believe everyone deserves to see clearly and look great doing it.</p>
          <b className='text-gray-800'>Our Services</b>
          <p>Prescription Glasses · Reglazing · Single Vision · Bifocal · Varifocal · Lens Coatings (Anti-Reflection, Blue Light, Photochromic) · Kids Frames · Designer Frames · Same-Day Collection</p>
        </div>
      </div>
      <div className='py-4 text-xl'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col mb-20 text-sm md:flex-row'>
        <div className='flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-20'>
          <b>In-House Manchester Lab</b>
          <p className='text-gray-600'>Our lenses are made on-site for faster turnaround and tighter quality control. No middlemen, no delays — just expertly crafted lenses dispatched quickly.</p>
        </div>
        <div className='flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-20'>
          <b>Save Money with Reglazing</b>
          <p className='text-gray-600'>Love your current frames? Send them to us and we'll fit brand new prescription lenses. It's eco-friendly, budget-friendly, and you keep the look you love.</p>
        </div>
        <div className='flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-20'>
          <b>Exceptional UK Support</b>
          <p className='text-gray-600'>Our friendly team is based right here in the UK. Whether you need help choosing lenses, understanding prescriptions, or tracking an order, we're just a message away.</p>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  )
}

export default About
