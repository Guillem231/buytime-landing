import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import KinectBackground from './KinectBackground';

const PrivacyPolicy = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textContainerRef = useRef(null);
  const [activeSection, setActiveSection] = useState('introduction');
  
  // Efecto para animar la entrada de los elementos de texto
  useEffect(() => {
    if (textContainerRef.current) {
      const title = textContainerRef.current.querySelector('.policy-title');
      const subtitle = textContainerRef.current.querySelector('.updated-date');
      const divider = textContainerRef.current.querySelector('.title-separator');
      const content = textContainerRef.current.querySelector('.policy-layout');
      
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.fromTo(title, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }
      )
      .fromTo(subtitle, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }, 
        "-=0.6"
      )
      .fromTo(divider, 
        { scaleX: 0, opacity: 0 }, 
        { scaleX: 1, opacity: 1, duration: 0.8 }, 
        "-=0.6"
      )
      .fromTo(content, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }, 
        "-=0.4"
      );
    }
  }, []);
  
  // Efecto de partículas para el título
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Ajustar el tamaño del canvas
    const resizeCanvas = () => {
      const headerContainer = document.querySelector('.header-container');
      if (headerContainer) {
        canvas.width = headerContainer.offsetWidth;
        canvas.height = headerContainer.offsetHeight * 1.2;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Partículas para el título
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(212, 175, 55, ${Math.random() * 0.6 + 0.2})`;
      }
      
      update() {
        this.x += this.speedX * 0.3;
        this.y += this.speedY * 0.3;
        
        if (this.size > 0.2) this.size -= 0.02;
        
        // Mantener partículas dentro del área del título
        if (this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height * 0.5) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * (canvas.height * 0.5);
          this.size = Math.random() * 3 + 1;
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Crear partículas
    const particles = [];
    const particleCount = Math.min(window.innerWidth / 3, 150);
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height * 0.5);
      particles.push(new Particle(x, y));
    }
    
    let animationFrameId;
    
    // Función de animación
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar partículas
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Dibujar líneas conectoras entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 - distance/1000})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  // Scroll al hacer clic en una sección
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };
  
  // Detectar sección activa al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.policy-section');
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });
      
      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);
  
  return (
    <div className="privacy-policy-page" ref={containerRef}>
      <KinectBackground showGUI={false} />
      
      <canvas 
        ref={canvasRef}
        className="title-particles-canvas"
      />
      
      <div className="policy-content" ref={textContainerRef}>
        <div className="header-container">
          <h1 className="policy-title">Privacy Policy</h1>
          <p className="updated-date">Last Updated: March 2025</p>
          <div className="title-separator"></div>
        </div>
        
        <div className="policy-layout">
          <div className="policy-nav">
            <div className="nav-header">Contents</div>
            <ul className="nav-sections">
              <li 
                className={activeSection === 'introduction' ? 'active' : ''}
                onClick={() => scrollToSection('introduction')}
              >
                Introduction
              </li>
              <li 
                className={activeSection === 'information-collection' ? 'active' : ''}
                onClick={() => scrollToSection('information-collection')}
              >
                Information Collection
              </li>
              <li 
                className={activeSection === 'information-usage' ? 'active' : ''}
                onClick={() => scrollToSection('information-usage')}
              >
                How We Use Your Information
              </li>
              <li 
                className={activeSection === 'information-sharing' ? 'active' : ''}
                onClick={() => scrollToSection('information-sharing')}
              >
                Information Sharing
              </li>
              <li 
                className={activeSection === 'data-security' ? 'active' : ''}
                onClick={() => scrollToSection('data-security')}
              >
                Data Security
              </li>
              <li 
                className={activeSection === 'user-rights' ? 'active' : ''}
                onClick={() => scrollToSection('user-rights')}
              >
                Your Rights
              </li>
              <li 
                className={activeSection === 'children' ? 'active' : ''}
                onClick={() => scrollToSection('children')}
              >
                Children's Privacy
              </li>
              <li 
                className={activeSection === 'changes' ? 'active' : ''}
                onClick={() => scrollToSection('changes')}
              >
                Changes to Policy
              </li>
              
            </ul>
            <div className="back-link">
              <Link to="/">← Back to Home</Link>
            </div>
          </div>
          
          <div className="policy-text">
            <section id="introduction" className="policy-section">
              <h2>Introduction</h2>
              <p>
                At BuyTime, we respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy will inform you about how we look after your personal data when you 
                visit our website and tell you about your privacy rights and how the law protects you.
              </p>
              <p>
                Please read this Privacy Policy carefully to understand our policies and practices 
                regarding your personal data and how we will treat it. If you do not agree with our 
                policies and practices, please do not use our website.
              </p>
            </section>
            
            {/* Mantén el resto de las secciones igual... */}
            <section id="information-collection" className="policy-section">
              <h2>Information Collection</h2>
              <p>
                We collect several types of information from and about users of our website, including:
              </p>
              <ul>
                <li>
                  <strong>Personal identifiers</strong>: Such as your name, email address, and contact information.
                </li>
                <li>
                  <strong>Technical data</strong>: Such as your IP address, browser type and version, time zone setting, 
                  browser plug-in types, operating system and platform, and other technology on the devices 
                  you use to access this website.
                </li>
                <li>
                  <strong>Usage data</strong>: Information about how you use our website, products, and services.
                </li>
              </ul>
              <p>
                We collect this information:
              </p>
              <ul>
                <li>Directly from you when you provide it to us.</li>
                <li>Automatically when you browse our website through cookies and similar technologies.</li>
                <li>From third parties, for example, our business partners.</li>
              </ul>
            </section>
            
            <section id="information-usage" className="policy-section">
              <h2>How We Use Your Information</h2>
              <p>
                We use the information that we collect about you or that you provide to us:
              </p>
              <ul>
                <li>To present our website and its contents to you.</li>
                <li>To provide you with information, products, or services that you request from us.</li>
                <li>To fulfill any other purpose for which you provide it.</li>
                <li>To carry out our obligations and enforce our rights.</li>
                <li>To notify you about changes to our website or products and services.</li>
                <li>To improve our website, products or services, marketing, or customer relationships.</li>
                <li>In any other way we may describe when you provide the information.</li>
                <li>For any other purpose with your consent.</li>
              </ul>
            </section>
            
            <section id="information-sharing" className="policy-section">
              <h2>Information Sharing</h2>
              <p>
                We may disclose personal information that we collect or you provide as described in this Privacy Policy:
              </p>
              <ul>
                <li>To our subsidiaries and affiliates.</li>
                <li>To contractors, service providers, and other third parties we use to support our business.</li>
                <li>To a buyer or other successor in the event of a merger, divestiture, restructuring, or other sale.</li>
                <li>To fulfill the purpose for which you provide it.</li>
                <li>For any other purpose disclosed by us when you provide the information.</li>
                <li>With your consent.</li>
              </ul>
              <p>
                We may also disclose your personal information:
              </p>
              <ul>
                <li>To comply with any court order, law, or legal process.</li>
                <li>To enforce or apply our terms of use and other agreements.</li>
                <li>If we believe disclosure is necessary to protect the rights, property, or safety of BuyTime, our customers, or others.</li>
              </ul>
            </section>
            
            <section id="data-security" className="policy-section">
              <h2>Data Security</h2>
              <p>
                We have implemented measures designed to secure your personal information from accidental loss and from 
                unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers.
              </p>
              <p>
                Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best 
                to protect your personal information, we cannot guarantee the security of your personal information transmitted 
                to our website. Any transmission of personal information is at your own risk.
              </p>
            </section>
            
            <section id="user-rights" className="policy-section">
              <h2>Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul>
                <li>The right to access your personal information.</li>
                <li>The right to rectify inaccurate personal information.</li>
                <li>The right to request the deletion of your personal information.</li>
                <li>The right to restrict the processing of your personal information.</li>
                <li>The right to data portability.</li>
                <li>The right to object to the processing of your personal information.</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided in the Contact Us section.
              </p>
            </section>
            
            <section id="children" className="policy-section">
              <h2>Children's Privacy</h2>
              <p>
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If you are under 13, do not use or provide any information on this 
                website or register, make any purchases, or provide any information about yourself to us.
              </p>
              <p>
                If we learn we have collected or received personal information from a child under 13 without verification 
                of parental consent, we will delete that information.
              </p>
            </section>
            
            <section id="changes" className="policy-section">
              <h2>Changes to Our Privacy Policy</h2>
              <p>
                We may update our privacy policy from time to time. If we make material changes to how we treat our users' 
                personal information, we will post the new privacy policy on this page.
              </p>
              <p>
                The date the privacy policy was last revised is identified at the top of the page. You are responsible for 
                periodically visiting our website and this privacy policy to check for any changes.
              </p>
            </section>
            
            
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .privacy-policy-page {
          position: relative;
          min-height: 100vh;
          width: 100%;
          color: #fff;
          background: none;
          overflow-x: hidden;
        }
        
        .title-particles-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 250px;
          z-index: 10;
          pointer-events: none;
        }
        
        .policy-content {
          position: relative;
          z-index: 20;
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        
        .header-container {
          text-align: center;
          margin-bottom: 5rem;
          padding-top: 3rem;
          position: relative;
        }
        
        .policy-title {
          font-size: 4rem;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 1rem;
          text-transform: uppercase;
          background: linear-gradient(45deg, var(--gold) 0%, #FFF8DC 50%, var(--gold) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.3));
        }
        
        .updated-date {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
          font-weight: 300;
          letter-spacing: 1px;
        }
        
        .title-separator {
          width: 120px;
          height: 3px;
          background: linear-gradient(to right, transparent, var(--gold), transparent);
          margin: 0 auto;
          opacity: 0.8;
        }
        
        .policy-layout {
          display: flex;
          gap: 4rem;
        }
        
        .policy-nav {
          position: sticky;
          top: 2rem;
          flex: 0 0 280px;
          height: fit-content;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 1.8rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 
                      0 0 15px rgba(212, 175, 55, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .nav-header {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 1.8rem;
          color: var(--gold);
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
          padding-bottom: 0.8rem;
          letter-spacing: 1px;
        }
        
        .nav-sections {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .nav-sections li {
          padding: 0.8rem 0.5rem;
          margin-bottom: 0.5rem;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.3s ease;
          position: relative;
          padding-left: 1.5rem;
          font-weight: 300;
          letter-spacing: 0.5px;
        }
        
        .nav-sections li:before {
          content: '•';
          position: absolute;
          left: 0.5rem;
          color: var(--gold);
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease;
          transform: scale(0);
        }
        
        .nav-sections li:hover {
          background: rgba(212, 175, 55, 0.1);
          transform: translateX(5px);
        }
        
        .nav-sections li:hover:before,
        .nav-sections li.active:before {
          opacity: 1;
          transform: scale(1);
        }
        
        .nav-sections li.active {
          background: rgba(212, 175, 55, 0.15);
          color: var(--gold);
          font-weight: 500;
          transform: translateX(5px);
        }
        
        .back-link {
          margin-top: 2.5rem;
          padding-top: 1.2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .back-link a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          letter-spacing: 0.5px;
        }
        
        .back-link a:hover {
          color: var(--gold);
          transform: translateX(-5px);
        }
        
        .policy-text {
          flex: 1;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(5px);
        }
        
        .policy-section {
          margin-bottom: 4rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          animation: fadeIn 0.5s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .policy-section:nth-child(1) { animation-delay: 0.2s; }
        .policy-section:nth-child(2) { animation-delay: 0.3s; }
        .policy-section:nth-child(3) { animation-delay: 0.4s; }
        .policy-section:nth-child(4) { animation-delay: 0.5s; }
        .policy-section:nth-child(5) { animation-delay: 0.6s; }
        .policy-section:nth-child(6) { animation-delay: 0.7s; }
        .policy-section:nth-child(7) { animation-delay: 0.8s; }
        .policy-section:nth-child(8) { animation-delay: 0.9s; }
        .policy-section:nth-child(9) { animation-delay: 1.0s; }
        
        .policy-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .policy-section h2 {
          font-size: 2rem;
          margin-bottom: 1.8rem;
          color: var(--gold);
          position: relative;
          letter-spacing: 1px;
        }
        
        .policy-section h2:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 60px;
          height: 2px;
          background: var(--gold);
          opacity: 0.6;
          transition: width 0.3s ease;
        }
        
        .policy-section:hover h2:after {
          width: 100px;
        }
        
        .policy-section p {
          margin-bottom: 1.4rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 300;
          font-size: 1.05rem;
        }
        
        .policy-section ul {
          padding-left: 1.8rem;
          margin-bottom: 1.8rem;
        }
        
        .policy-section li {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 300;
          position: relative;
          padding-left: 0.5rem;
        }
        
        .policy-section li::marker {
          color: var(--gold);
        }
        
        .policy-section strong {
          color: white;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .contact-info {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 2rem;
          margin: 2rem 0;
          border-left: 3px solid var(--gold);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .contact-info:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }
        
        .contact-info p {
          margin-bottom: 0.9rem;
        }
        
        .contact-info p:last-child {
          margin-bottom: 0;
        }
        
        /* Animación para el scroll */
        html {
          scroll-behavior: smooth;
        }
        
        /* Responsive styles */
        @media (max-width: 1200px) {
          .policy-content {
            padding: 3rem 1.5rem;
          }
        }
        
        @media (max-width: 992px) {
          .policy-layout {
            flex-direction: column;
            gap: 2rem;
          }
          
          .policy-nav {
            position: relative;
            top: 0;
            flex: none;
            width: 100%;
            margin-bottom: 2rem;
          }
          
          .policy-title {
            font-size: 3.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .header-container {
            margin-bottom: 3rem;
            padding-top: 2rem;
          }
          
          .policy-title {
            font-size: 2.8rem;
          }
          
          .policy-section h2 {
            font-size: 1.8rem;
          }
          
          .policy-text {
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .policy-title {
            font-size: 2.2rem;
          }
          
          .policy-section h2 {
            font-size: 1.5rem;
          }
          
          .policy-section p, 
          .policy-section li {
            font-size: 1rem;
          }
          
          .contact-info {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;

