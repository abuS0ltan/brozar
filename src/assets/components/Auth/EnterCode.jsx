'use client'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Joi from 'joi'
import 'bootstrap/dist/css/bootstrap.min.css'
import './auth.css'

const schema = Joi.object({
  code: Joi.string().length(6).required().messages({
    'string.length': 'Code must be exactly 6 digits',
    'string.empty': 'Code is required'
  })
})

export default function EnterCode() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const email = localStorage.getItem('forgotPasswordEmail');
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: ''
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
        
        const response = await axios.post(apiUrl + '/auth/reset-password/verify-code', { email, code: formData.code })
        // Save code to localStorage
        localStorage.setItem('verificationCode', formData.code)

        // Navigate to the enter new password page
        navigate('/restpassword')
      } catch (error) {
        console.error('Request failed:', error)
        if (error.response?.status === 400) {
          setFormError('Invalid or expired code')
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
              <h2 className="text-center mb-4">Enter Verification Code</h2>
              <p className='text-secondary text-center'>Code has been send to <span className='text-dark fw-bold'>{email}</span>. Enter the code to verify your account.</p>
              {formError && (
                <div className="alert alert-danger" role="alert">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Verification Code</label>
                  <input
                    type="text"
                    className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder='6 digit code'
                  />
                  {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                </div>

                <button
                  type="submit"
                  className="btn sub-btn w-100 py-2 mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>

                <div className="d-flex justify-content-between mt-4">
                  <a href="/help" className="text-decoration-none">Need help?</a>
                  <a href="/login" className="text-decoration-none">Back to login?</a>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
