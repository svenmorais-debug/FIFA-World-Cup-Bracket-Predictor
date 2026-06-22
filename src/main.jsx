import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.jsx';
import PublicBracketView from './components/PublicBracketView.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"                    element={<App />} />
          <Route path="/share/:shareToken"   element={<PublicBracketView />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
