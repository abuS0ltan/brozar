'use client'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Joi from 'joi'
import { jwtDecode } from 'jwt-decode'
import { Eye, EyeOff } from 'lucide-react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './auth.css'
const schema = Joi.object({
  email: Joi.string().email({ tlds: false }).required().messages({
    'string.email': 'Please enter a valid email',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
})

export default function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
        const response = await axios.post(apiUrl+'/auth/login', formData)
        const { token } = response.data
        // Decode the token
        const decodedToken = jwtDecode(token)

        // Extract user information from the decoded token
        const user = {
          id: decodedToken.sub,
          email: decodedToken.email,
          name: decodedToken.name,
          role: decodedToken.role
          // Add any other relevant user information from the token
        }

        // Store token and user info in localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Redirect to main page
        navigate('/')
      } catch (error) {
        console.error('Login failed:', error)
        if (error.response?.status === 401) {
          setFormError('Invalid email or password')
        } else if (error.response?.data?.message) {
          setFormError(error.response.data.message)
        } else if (error.message === 'Invalid token specified') {
          setFormError('Authentication error. Please try again.')
        } else {
          setFormError('An error occurred during login. Please try again.')
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
              <h2 className="text-center mb-4">Sign in</h2>

              {formError && (
                <div className="alert alert-danger" role="alert">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email or mobile phone number</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label">Your password</label>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <span className="text-muted">Hide</span>
                      ) : (
                        <span className="text-muted">Show</span>
                      )}
                    </button>
                  </div>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn sub-btn w-100 py-2 mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Log in'}
                </button>

                <p className="text-center small mt-3">
                  By continuing, you agree to the{' '}
                  <a href="/terms" className="text-decoration-none">Terms of use</a> and{' '}
                  <a href="/privacy" className="text-decoration-none">Privacy Policy</a>.
                </p>

                <div className="d-flex justify-content-between mt-4">
                  <a href="/help" className="text-decoration-none">Other issue with sign in</a>
                  <a href="/forgot-password" className="text-decoration-none">Forget your password</a>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-muted mb-3">New to our community</p>
            <a
              href="/register"
              className="btn btn-outline-secondary w-100 py-2"
            >
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

