'use client'

import React, { useState } from 'react'
import axios from 'axios'
import Joi from 'joi'
import './auth.css'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
const schema = Joi.object({
  firstName: Joi.string().required().messages({
    'string.empty': 'First name is required'
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Last name is required'
  }),
  bio: Joi.string().required().messages({
    'string.empty': 'Bio is required'
  }),
  email: Joi.string().email({ tlds: false }).required().messages({
    'string.email': 'Please enter a valid email',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.empty': 'Password is required'
  }),
  passwordVerify: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords must match',
    'string.empty': 'Password confirmation is required'
  }),
  role: Joi.string().valid('owner', 'user', 'investor').required().messages({
    'any.only': 'Role must be one of: owner, user, investor',
    'string.empty': 'Role is required'
  }),
  birthDate: Joi.date().required().messages({
    'date.base': 'Please enter a valid date',
    'any.required': 'Birth date is required'
  })
});
export default function Register() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    email: '',
    password: '',
    passwordVerify: '',
    role: '',
    birthDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    const { error } = schema.validate(formData, { abortEarly: false });
    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setServerError('');
      console.log(formData);
      try {
        const response = await axios.post(apiUrl+'/auth/register', formData);
        console.log('Registration successful:', response.data);
        navigate('/login');
      } catch (error) {
        console.error('Registration failed:', error);
        setServerError('An error occurred during registration. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4">
            <h2 className="text-center mb-4">Create an account</h2>
            <p className="text-center mb-4">
              Already have an account? <a href="/login" className="text-decoration-none">Log in</a>
            </p>

            {serverError && <div className="alert alert-danger">{serverError}</div>}

            <form onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="mb-3">
                <label className="form-label">What should we call you?</label>
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      placeholder="First name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      placeholder="Last name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>
                </div>
              </div>

              {/* Bio Field */}
              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea
                  className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                />
                {errors.bio && <div className="invalid-feedback">{errors.bio}</div>}
              </div>

              {/* Email Field */}
              <div className="mb-3">
                <label className="form-label">What's your email?</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Date of Birth Field */}
              <div className="mb-3">
                <label className="form-label">What's your date of birth?</label>
                <input
                  type="date"
                  className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
                {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
              </div>

              {/* Role Selection */}
              <div className="mb-3">
                <label className="form-label">Account Type</label>
                <select
                  className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="owner">Owner</option>
                  <option value="investor">Investor</option>
                </select>
                {errors.role && <div className="invalid-feedback">{errors.role}</div>}
              </div>

              {/* Password Fields */}
              <div className="mb-3">
                <label className="form-label">Create a password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <small className="text-muted">Use 8 or more characters with a mix of letters, numbers & symbols</small>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm password</label>
                <div className="input-group">
                  <input
                    type={showPasswordVerify ? 'text' : 'password'}
                    className={`form-control ${errors.passwordVerify ? 'is-invalid' : ''}`}
                    placeholder="Confirm your password"
                    name="passwordVerify"
                    value={formData.passwordVerify}
                    onChange={handleChange}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPasswordVerify(!showPasswordVerify)}
                  >
                    {showPasswordVerify ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.passwordVerify && <div className="invalid-feedback">{errors.passwordVerify}</div>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn sub-btn w-100"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create an account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
