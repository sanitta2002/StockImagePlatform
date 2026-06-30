import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import axios, { AxiosError } from 'axios';
import { APP_ROUTES } from '../constants/routes';
import type { AuthResponse } from '../types/auth';
import { useToast } from '../context/ToastContext';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword({ email });
      toast('If an account with that email exists, a reset link has been sent.', 'success');
      setEmail('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<AuthResponse>;
        setError(axiosError.response?.data?.message || 'Failed to send reset link');
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
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">Enter your email to receive a reset link</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleForgotPassword} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="auth-footer">
          Remember your password? <Link to={APP_ROUTES.LOGIN}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};
