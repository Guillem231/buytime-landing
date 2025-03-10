import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import HeroSection from './components/Hero';
import FutureSection from './components/Future';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import BlackHole from './components/BlackHole';
import CountdownFooter from './components/Countdown';
import MobileBlocker from './components/MobileBlocker';

import './styles/main.css';


const HomePage = () => (
  <>
    <HeroSection />
    <BlackHole/>
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
        <MobileBlocker /> 
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
