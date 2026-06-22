import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { firebaseConfigured } from './firebase';
import App from './App.jsx';
import PublicBracketView from './components/PublicBracketView.jsx';
import './index.css';

function FirebaseSetupScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg,#0f2a45,#1a6fad)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui,sans-serif', padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '40px 36px',
        maxWidth: 500, width: '100%', boxShadow: '0 25px 80px rgba(0,0,0,.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48 }}>⚽</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a6fad', margin: '8px 0 4px' }}>
            FIFA World Cup 2026
          </h1>
          <p style={{ color: '#6b7280', fontSize: 13 }}>Bracket Predictor — Setup Required</p>
        </div>

        <div style={{
          background: '#fef9c3', border: '1.5px solid #fde047', borderRadius: 8,
          padding: '14px 16px', marginBottom: 24, fontSize: 13, color: '#854d0e',
        }}>
          Firebase is not configured. The app needs a <code>.env.local</code> file with your Firebase credentials to run.
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Setup steps:</h2>
        <ol style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 20, color: '#374151' }}>
          <li>Go to <strong>console.firebase.google.com</strong> and create a project</li>
          <li>Enable <strong>Authentication → Email/Password</strong></li>
          <li>Enable <strong>Firestore Database</strong></li>
          <li>Go to Project Settings → add a Web App → copy the config</li>
          <li>Create a <code>.env.local</code> file in the project root:</li>
        </ol>

        <pre style={{
          background: '#f1f5f9', borderRadius: 6, padding: '12px 14px',
          fontSize: 11, marginTop: 12, overflowX: 'auto', color: '#1e293b',
        }}>{`VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id`}</pre>

        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 16 }}>
          After creating <code>.env.local</code>, restart the dev server (<code>npm run dev</code>).
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {!firebaseConfigured ? (
      <FirebaseSetupScreen />
    ) : (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/"                  element={<App />} />
            <Route path="/share/:shareToken" element={<PublicBracketView />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    )}
  </StrictMode>,
);
