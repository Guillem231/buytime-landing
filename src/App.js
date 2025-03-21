import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import HeroSection from './components/Hero';
import FutureSection from './components/Future';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import BlackHole from './components/BlackHole';
import CountdownFooter from './components/Countdown';
import MobileBlocker from './components/MobileBlocker';
import MobileParticleBackground from './components/MobileParticleBackground';
import PageLoader from './components/Loader/PageLoader'; // Importa el nuevo PageLoader

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Función para detectar si es un dispositivo móvil
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      
      // Otra opción es verificar por tamaño de pantalla
      const isMobileBySize = window.innerWidth <= 768;
      
      setIsMobile(mobileRegex.test(userAgent) || isMobileBySize);
    };

    // Comprobar al cargar y al cambiar el tamaño de la ventana
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    // Solo desactivar el cursor normal en dispositivos no móviles
    if (!isMobile) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [isMobile]);

  return (
    <div className="App">
      <PageLoader /> {/* Añade el PageLoader antes del BrowserRouter */}
      <BrowserRouter>
        {/* <MobileBlocker />  */}
        {!isMobile && <CustomCursor />}
        {isMobile && <MobileParticleBackground />}
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
