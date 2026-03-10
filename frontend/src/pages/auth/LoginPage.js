import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const LoginPage = () => {
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const { user, token } = await loginUser({ email, password, role });
      login(user, token);
      navigate(role === 'broker' ? '/broker/dashboard' : '/customer/properties');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    if (role === 'broker') { setEmail('broker@demo.com'); setPassword('password'); }
    else { setEmail('customer@demo.com'); setPassword('password'); }
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
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account to continue</p>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-demo">
            <button onClick={fillDemo} className="demo-btn">
              ✨ Fill Demo Credentials ({role})
            </button>
          </div>

          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to="/signup">Create one →</Link>
          </p>
        </div>

        <div className="auth-hint">
          <span>Demo: broker@demo.com / customer@demo.com — password: <strong>password</strong></span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
