import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function friendlyError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export default function LoginModal() {
  const { signup, login, resetPassword } = useAuth();
  const [tab,      setTab]      = useState('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [info,     setInfo]     = useState('');
  const [loading,  setLoading]  = useState(false);

  function switchTab(t) { setTab(t); setError(''); setInfo(''); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setInfo('');
    setLoading(true);
    try {
      if (tab === 'login') await login(email, password);
      else                 await signup(email, password);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!email) { setError('Enter your email address first.'); return; }
    setError(''); setLoading(true);
    try {
      await resetPassword(email);
      setInfo('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="auth-logo">
          <span className="auth-logo-icon">⚽</span>
          <div>
            <div className="auth-logo-title">FIFA World Cup 2026</div>
            <div className="auth-logo-sub">Bracket Predictor</div>
          </div>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login'  ? 'auth-tab--active' : ''}`} onClick={() => switchTab('login')}>Log In</button>
          <button className={`auth-tab ${tab === 'signup' ? 'auth-tab--active' : ''}`} onClick={() => switchTab('signup')}>Sign Up</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          {info  && <div className="auth-info">{info}</div>}

          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
          />

          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={tab === 'signup' ? 'At least 6 characters' : '••••••••'}
            required={tab !== 'reset'}
            minLength={tab === 'signup' ? 6 : undefined}
          />

          <button className="btn btn--primary auth-submit" disabled={loading} type="submit">
            {loading ? 'Please wait…' : tab === 'login' ? 'Log In' : 'Create Account'}
          </button>

          {tab === 'login' && (
            <button type="button" className="auth-forgot" onClick={handleReset} disabled={loading}>
              Forgot password?
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
