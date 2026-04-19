import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext.jsx';
import { ShieldCheck, LogIn, Mail, Lock } from 'lucide-react';

const AdminLogin = () => {
  const { loginWithGoogle, loginWithEmail, authError, authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    await loginWithEmail(email, password);
    setSubmitting(false);
  };

  if (authLoading) {
    return (
      <div className="page-loader" role="status" aria-label="Checking authentication...">
        <div className="loader-spinner" />
      </div>
    );
  }

  return (
    <section
      aria-labelledby="login-heading"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: '1.5rem',
        padding: '2rem',
      }}
    >
      {/* Icon */}
      <div style={{
        width: '72px', height: '72px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        borderRadius: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 32px var(--primary-glow)',
      }}>
        <ShieldCheck size={36} color="white" aria-hidden="true" />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1 id="login-heading" style={{ marginBottom: '0.25rem' }}>Admin Login</h1>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
          Sign in to access the Command Center
        </p>
      </div>

      {/* Google Sign-In */}
      <button
        id="google-signin-btn"
        className="btn w-full"
        onClick={loginWithGoogle}
        disabled={submitting}
        aria-label="Sign in with Google"
        style={{
          background: 'white',
          color: '#1f2937',
          border: '1px solid rgba(255,255,255,0.2)',
          maxWidth: '320px',
          gap: '0.75rem',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '320px' }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--glass-border)' }} />
        <span className="text-muted" style={{ fontSize: '0.8rem' }}>or</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--glass-border)' }} />
      </div>

      {/* Email/Password Form */}
      <form
        onSubmit={handleEmailLogin}
        style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        aria-label="Email and password login form"
        noValidate
      >
        <div style={{ position: 'relative' }}>
          <label htmlFor="admin-email" className="sr-only">Email address</label>
          <Mail size={16} aria-hidden="true" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            autoComplete="email"
            required
            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <label htmlFor="admin-password" className="sr-only">Password</label>
          <Lock size={16} aria-hidden="true" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
          />
        </div>

        {authError && (
          <p role="alert" style={{ color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center' }}>
            {authError}
          </p>
        )}

        <button
          id="email-signin-btn"
          type="submit"
          className="btn btn-primary w-full"
          disabled={submitting || !email || !password}
          aria-label="Sign in with email and password"
        >
          <LogIn size={18} aria-hidden="true" />
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
        ← Return to Home
      </a>
    </section>
  );
};

export default AdminLogin;
