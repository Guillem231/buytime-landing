import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import HeroSection from './components/HeroSection';
import FutureSection from './components/FutureSection';
import BlackHoleInterface from './components/BlackHoleInterface';
import CountdownFooter from './components/CountdownFooter';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

import './styles/main.css';
import './styles/advanced-animations.css';
import './styles/future-section.css';
import './styles/showcase-section.css';

// Componente para la página principal
const HomePage = () => (
  <>
    <HeroSection />
    <div style={{ 
      position: 'relative', 
      zIndex: 5,
      marginBottom: '10rem',
      minHeight: '500px',
      width: '100%',
    }}>
      <BlackHoleInterface />
    </div>
    <FutureSection />
    <CountdownFooter />
  </>
);

function App() {
  useEffect(() => {
    document.body.style.cursor = 'none';
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
                <CustomCursor />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
