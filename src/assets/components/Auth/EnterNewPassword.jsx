'use client'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Joi from 'joi'
import { Eye, EyeOff } from 'lucide-react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './auth.css'

const schema = Joi.object({
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.empty': 'Password is required'
  }),
  newPasswordVerify: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords must match',
    'string.empty': 'Password confirmation is required'
  })
})

export default function EnterNewPassword() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: '',
    newPasswordVerify: ''
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
        const email = localStorage.getItem('forgotPasswordEmail');
        const code = localStorage.getItem('verificationCode');

        const response = await axios.post(apiUrl + '/auth/reset-password', {
          email,
          code,
          newPassword: formData.newPassword,
          newPasswordVerify: formData.newPasswordVerify
        })

        // Navigate to the login page
        navigate('/login')
      } catch (error) {
        console.error('Request failed:', error)
        if (error.response?.status === 400) {
          setFormError('Invalid request. Please try again.')
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
              <h2 className="text-center mb-4">Set New Password</h2>
              <p className='text-secondary text-center'>Please enter and confirm your new password. You will need to login after you reset.</p>

              {formError && (
                <div className="alert alert-danger" role="alert">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`form-control ${errors.newPasswordVerify ? 'is-invalid' : ''}`}
                      name="newPasswordVerify"
                      value={formData.newPasswordVerify}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                  </div>
                  {errors.newPasswordVerify && <div className="invalid-feedback">{errors.newPasswordVerify}</div>}
                </div>

                <button
                  type="submit"
                  className="btn sub-btn w-100 py-2 mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
