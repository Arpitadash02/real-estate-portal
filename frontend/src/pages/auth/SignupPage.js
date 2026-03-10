import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const SignupPage = () => {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const { user, token } = await signupUser({ name, email, password, role });
      login(user, token);
      navigate(role === 'broker' ? '/broker/dashboard' : '/customer/properties');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-orb orb-1" />
        <div className="auth-bg-orb orb-2" />
        <div className="auth-bg-orb orb-3" />
      </div>
      <div className="auth-container">
        <div className="auth-logo">
          <span className="auth-logo-icon">⬡</span>
          <span className="auth-logo-text">LuxeEstate</span>
        </div>

        <div className="auth-card card">
          <div className="auth-card-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join LuxeEstate and find your dream home</p>
          </div>

          {/* Role Toggle */}
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn${role === 'customer' ? ' active' : ''}`}
              onClick={() => { setRole('customer'); setError(''); }}
            >
              🏡 Customer
            </button>
            <button
              type="button"
              className={`role-btn${role === 'broker' ? ' active' : ''}`}
              onClick={() => { setRole('broker'); setError(''); }}
            >
              🏢 Broker
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? 'Creating Account...' : `Create ${role === 'broker' ? 'Broker' : 'Customer'} Account`}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
