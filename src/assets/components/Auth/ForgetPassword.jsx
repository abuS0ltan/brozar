'use client'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Joi from 'joi'
import 'bootstrap/dist/css/bootstrap.min.css'
import './auth.css'

const schema = Joi.object({
  email: Joi.string().email({ tlds: false }).required().messages({
    'string.email': 'Please enter a valid email',
    'string.empty': 'Email is required'
  })
})

export default function ForgotPassword() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: ''
  })

  const validateForm = () => {
    const { error } = schema.validate(formData, { abortEarly: false })
    if (error) {
      const validationErrors = {}
      error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message
      })
      setErrors(validationErrors)
      return false
    }
    setErrors({})
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (validateForm()) {
      setIsLoading(true)
      try {
        const response = await axios.post(apiUrl + '/auth/forgot-password', { email: formData.email })

        // Save email to localStorage
        localStorage.setItem('forgotPasswordEmail', formData.email)

        // Navigate to the enter code page
        navigate('/entercode')
      } catch (error) {
        console.error('Request failed:', error)
        if (error.response?.status === 400) {
          setFormError('Invalid email address or user not found')
        } else if (error.response?.data?.message) {
          setFormError(error.response.data.message)
        } else {
          setFormError('An error occurred. Please try again later.')
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setFormError('')
  }

  return (
    <div className="auth container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Forgot Password</h2>
              <p className='text-secondary mb-2 text-center'>No worries! Enter your email address below and we will send you a code to reset password.</p>
              {formError && (
                <div className="alert alert-danger" role="alert">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <button
                  type="submit"
                  className="btn sub-btn w-100 py-2 mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Code'}
                </button>

                

                <div className="d-flex justify-content-between mt-4">
                  <a href="/help" className="text-decoration-none">Need help?</a>
                  <a href="/login" className="text-decoration-none">Back to Login</a>
                </div>
              </form>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  )
}
