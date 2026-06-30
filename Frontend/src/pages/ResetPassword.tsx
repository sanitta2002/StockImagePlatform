import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import axios, { AxiosError } from 'axios';
import { APP_ROUTES } from '../constants/routes';
import type { AuthResponse } from '../types/auth';
import { useToast } from '../context/ToastContext';

export const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!token) {
      setError("Reset token is missing from the URL.");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await authService.resetPassword({ token, newPassword });
      toast('Password reset successfully. You can now sign in.', 'success');
      navigate(APP_ROUTES.LOGIN);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<AuthResponse>;
        setError(axiosError.response?.data?.message || 'Failed to reset password');
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
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Enter your new password below</p>
        
        {error && <div className="auth-error">{error}</div>}
        {!token && <div className="auth-error">Invalid or missing reset token.</div>}
        
        <form onSubmit={handleResetPassword} className="auth-form">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={!token}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={!token}
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading || !token}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        
        <div className="auth-footer">
          Back to <Link to={APP_ROUTES.LOGIN}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};
