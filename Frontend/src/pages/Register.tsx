import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import axios, { AxiosError } from 'axios';
import { APP_ROUTES } from '../constants/routes';
import type { AuthResponse } from '../types/auth';
import { useToast } from '../context/ToastContext';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(formData);
      toast('Account created successfully! Please sign in.', 'success');
      navigate(APP_ROUTES.LOGIN);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<AuthResponse>;
        setError(axiosError.response?.data?.message || 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join StockImagePlatform today</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group row">
            <div className="col">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First name" />
            </div>
            <div className="col">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last name" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} required placeholder="name@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 234 567 8900" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to={APP_ROUTES.LOGIN}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};
