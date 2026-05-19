import React, { useState } from 'react'
import axios from 'axios'
import { getApiBaseUrl } from '../utils/apiConfig.js'

const NewsLetterBox = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    if (!email.trim()) {
      setStatus({ type: 'error', message: 'Please enter a valid email' })
      return
    }
    setLoading(true)
    setStatus({ type: '', message: '' })
    try {
      const backendUrl = getApiBaseUrl();
      const res = await axios.post(`${backendUrl}/api/newsletter`, { email })
      if (res.data.success) {
        setStatus({ type: 'success', message: '✅ ' + res.data.message })
        setEmail('')
      } else {
        setStatus({ type: 'error', message: res.data.message })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mt-10 text-center'>
      <p className='text-2xl font-medium text-gray-800'>Join the Sapphire Squad</p>
      <p className='mt-3 text-gray-400'>Get 10% off your first order & early access to new drops!</p>
      <form onSubmit={onSubmitHandler} className='flex items-center w-full gap-3 pl-3 mx-auto my-6 border sm:w-1/2'>
        <input
          className='w-full outline-none sm:flex-1'
          type="email"
          placeholder='Enter your email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type='submit' disabled={loading} className='px-10 py-4 text-xs text-white bg-black disabled:opacity-60'>
          {loading ? 'SUBSCRIBING...' : 'JOIN THE SQUAD'}
        </button>
      </form>
      {status.message && (
        <p className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {status.message}
        </p>
      )}
    </div>
  )
}

export default NewsLetterBox
