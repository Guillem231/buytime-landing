import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import KinectBackground from './KinectBackground';

const TermsOfService = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textContainerRef = useRef(null);
  const [activeSection, setActiveSection] = useState('introduction');
  
  // Efecto para animar la entrada de los elementos de texto
  useEffect(() => {
    if (textContainerRef.current) {
      const title = textContainerRef.current.querySelector('.terms-title');
      const subtitle = textContainerRef.current.querySelector('.updated-date');
      const divider = textContainerRef.current.querySelector('.title-separator');
      const content = textContainerRef.current.querySelector('.terms-layout');
      
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
      const sections = document.querySelectorAll('.terms-section');
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
    <div className="terms-of-service-page" ref={containerRef}>
      <KinectBackground showGUI={false} />
      
      <canvas 
        ref={canvasRef}
        className="title-particles-canvas"
      />
      
      <div className="terms-content" ref={textContainerRef}>
        <div className="header-container">
          <h1 className="terms-title">Terms of Service</h1>
          <p className="updated-date">Last Updated: March 2025</p>
          <div className="title-separator"></div>
        </div>
        
        <div className="terms-layout">
          <div className="terms-nav">
            <div className="nav-header">Contents</div>
            <ul className="nav-sections">
              <li 
                className={activeSection === 'introduction' ? 'active' : ''}
                onClick={() => scrollToSection('introduction')}
              >
                Introduction
              </li>
              <li 
                className={activeSection === 'acceptance' ? 'active' : ''}
                onClick={() => scrollToSection('acceptance')}
              >
                Acceptance of Terms
              </li>
              <li 
                className={activeSection === 'eligibility' ? 'active' : ''}
                onClick={() => scrollToSection('eligibility')}
              >
                Eligibility
              </li>
              <li 
                className={activeSection === 'accounts' ? 'active' : ''}
                onClick={() => scrollToSection('accounts')}
              >
                User Accounts
              </li>
              <li 
                className={activeSection === 'services' ? 'active' : ''}
                onClick={() => scrollToSection('services')}
              >
                Services
              </li>
              <li 
                className={activeSection === 'intellectual-property' ? 'active' : ''}
                onClick={() => scrollToSection('intellectual-property')}
              >
                Intellectual Property
              </li>
              <li 
                className={activeSection === 'prohibited' ? 'active' : ''}
                onClick={() => scrollToSection('prohibited')}
              >
                Prohibited Activities
              </li>
              <li 
                className={activeSection === 'disclaimer' ? 'active' : ''}
                onClick={() => scrollToSection('disclaimer')}
              >
                Disclaimers
              </li>
              <li 
                className={activeSection === 'limitation' ? 'active' : ''}
                onClick={() => scrollToSection('limitation')}
              >
                Limitation of Liability
              </li>
              <li 
                className={activeSection === 'termination' ? 'active' : ''}
                onClick={() => scrollToSection('termination')}
              >
                Termination
              </li>
              <li 
                className={activeSection === 'governing-law' ? 'active' : ''}
                onClick={() => scrollToSection('governing-law')}
              >
                Governing Law
              </li>
              <li 
                className={activeSection === 'changes' ? 'active' : ''}
                onClick={() => scrollToSection('changes')}
              >
                Changes to Terms
              </li>
             
            </ul>
            <div className="back-link">
              <Link to="/">← Back to Home</Link>
            </div>
          </div>
          
          <div className="terms-text">
            <section id="introduction" className="terms-section">
              <h2>Introduction</h2>
              <p>
                Welcome to BuyTime! These Terms of Service ("Terms") govern your access to and use of 
                the BuyTime website, services, and applications (collectively, the "Services").
              </p>
              <p>
                Please read these Terms carefully before using our Services. By accessing or using our Services, 
                you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, 
                please do not use our Services.
              </p>
            </section>
            
            {/* Mantener el resto de secciones igual al código original */}
            <section id="acceptance" className="terms-section">
              <h2>Acceptance of Terms</h2>
              <p>
                By creating an account, accessing, or using our Services, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms. If you are using the Services on behalf of 
                a company, organization, or other entity, then "you" means you and such entity, and you represent 
                and warrant that you are an authorized representative of the entity with the authority to bind the 
                entity to these Terms.
              </p>
            </section>
            
            <section id="eligibility" className="terms-section">
              <h2>Eligibility</h2>
              <p>
                You must be at least 18 years old to use our Services. By using our Services, you represent and 
                warrant that you meet all eligibility requirements we outline in these Terms. We may still provide 
                the Services to you if you are between 13 and 18 years old, but only if you have consent from your 
                parent or legal guardian.
              </p>
            </section>
            
            <section id="accounts" className="terms-section">
              <h2>User Accounts</h2>
              <p>
                When you create an account with us, you guarantee that the information you provide is accurate, 
                complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in 
                the immediate termination of your account.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account and password, including but 
                not limited to restricting access to your computer and/or account. You agree to accept responsibility 
                for any and all activities or actions that occur under your account and/or password.
              </p>
              <p>
                You must notify us immediately upon becoming aware of any breach of security or unauthorized use 
                of your account.
              </p>
            </section>
            
            <section id="services" className="terms-section">
              <h2>Services</h2>
              <p>
                BuyTime provides a platform that allows users to trade time-based services. Our Services are subject to 
                change without notice. We reserve the right to modify, suspend, or discontinue the Services at any time, 
                without notice or liability to you.
              </p>
              <p>
                We make no guarantee that our Services will be available at all times. We may experience hardware, software, 
                or other technical issues that may temporarily or permanently disable access to certain features or 
                functionalities of our Services.
              </p>
              <p>
                We reserve the right to refuse to provide the Services to any user for any reason at any time.
              </p>
            </section>

            <section id="intellectual-property" className="terms-section">
              <h2>Intellectual Property</h2>
              <p>
                The Services and its original content, features, and functionality are and will remain the exclusive property 
                of BuyTime and its licensors. The Services are protected by copyright, trademark, and other laws of both the 
                United States and foreign countries.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior 
                written consent of BuyTime.
              </p>
              <p>
                You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Services, use of the 
                Services, or access to the Services without express written permission from us.
              </p>
            </section>

            <section id="prohibited" className="terms-section">
              <h2>Prohibited Activities</h2>
              <p>
                You may use our Services only for lawful purposes and in accordance with these Terms. You agree not to use our Services:
              </p>
              <ul>
                <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                <li>To exploit, harm, or attempt to exploit or harm minors in any way.</li>
                <li>To transmit any material that is defamatory, obscene, indecent, abusive, offensive, harassing, violent, 
                    hateful, inflammatory, or otherwise objectionable.</li>
                <li>To impersonate or attempt to impersonate BuyTime, a BuyTime employee, another user, or any other person or entity.</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services.</li>
                <li>To attempt to bypass any security measures or features on our platform.</li>
                <li>To use any robot, spider, or other automatic device, process, or means to access the Services for any purpose.</li>
              </ul>
              <p>
                We have the right to terminate your access to our Services for violating any of these prohibited activities.
              </p>
            </section>

            <section id="disclaimer" className="terms-section">
              <h2>Disclaimers</h2>
              <p>
                YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK. THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. 
                BUYTIME EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO 
                THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                BUYTIME MAKES NO WARRANTY THAT (i) THE SERVICES WILL MEET YOUR REQUIREMENTS, (ii) THE SERVICES WILL BE UNINTERRUPTED, 
                TIMELY, SECURE, OR ERROR-FREE, (iii) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICES WILL BE ACCURATE 
                OR RELIABLE, OR (iv) THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR OBTAINED 
                BY YOU THROUGH THE SERVICES WILL MEET YOUR EXPECTATIONS.
              </p>
            </section>

            <section id="limitation" className="terms-section">
              <h2>Limitation of Liability</h2>
              <p>
                IN NO EVENT SHALL BUYTIME, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY DIRECT, 
                INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER RESULTING FROM (i) ERRORS, 
                MISTAKES, OR INACCURACIES OF CONTENT, (ii) PERSONAL INJURY OR PROPERTY DAMAGE, (iii) UNAUTHORIZED ACCESS TO 
                OR USE OF OUR SERVERS AND/OR ANY PERSONAL INFORMATION STORED THEREIN, (iv) INTERRUPTION OR CESSATION OF 
                TRANSMISSION TO OR FROM OUR SERVICES, (v) BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE TRANSMITTED TO OR THROUGH 
                OUR SERVICES, AND/OR (vi) ANY ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED 
                AS A RESULT OF YOUR USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES, WHETHER 
                BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY.
              </p>
              <p>
                THE FOREGOING LIMITATION OF LIABILITY SHALL APPLY TO THE FULLEST EXTENT PERMITTED BY LAW IN THE APPLICABLE JURISDICTION.
              </p>
            </section>

            <section id="termination" className="terms-section">
              <h2>Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, 
                under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of 
                the Terms.
              </p>
              <p>
                If you wish to terminate your account, you may simply discontinue using the Services or contact us to deactivate 
                your account.
              </p>
              <p>
                All provisions of the Terms which by their nature should survive termination shall survive termination, including, 
                without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>

            <section id="governing-law" className="terms-section">
              <h2>Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to 
                its conflict of law provisions.
              </p>
              <p>
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If 
                any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these 
                Terms will remain in effect.
              </p>
              <p>
                These Terms constitute the entire agreement between us regarding our Services, and supersede and replace any prior 
                agreements we might have had between us regarding the Services.
              </p>
            </section>

            <section id="changes" className="terms-section">
              <h2>Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material 
                we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will 
                be determined at our sole discretion.
              </p>
              <p>
                By continuing to access or use our Services after any revisions become effective, you agree to be bound by the revised 
                terms. If you do not agree to the new terms, you are no longer authorized to use the Services.
              </p>
            </section>

            
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .terms-of-service-page {
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
        
        .terms-content {
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
        
        .terms-title {
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
        
        .terms-layout {
          display: flex;
          gap: 4rem;
        }
        
        .terms-nav {
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
        
        .terms-text {
          flex: 1;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(5px);
        }
        
        .terms-section {
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
        
        .terms-section:nth-child(1) { animation-delay: 0.2s; }
        .terms-section:nth-child(2) { animation-delay: 0.3s; }
        .terms-section:nth-child(3) { animation-delay: 0.4s; }
        .terms-section:nth-child(4) { animation-delay: 0.5s; }
        .terms-section:nth-child(5) { animation-delay: 0.6s; }
        .terms-section:nth-child(6) { animation-delay: 0.7s; }
        .terms-section:nth-child(7) { animation-delay: 0.8s; }
        .terms-section:nth-child(8) { animation-delay: 0.9s; }
        .terms-section:nth-child(9) { animation-delay: 1.0s; }
        .terms-section:nth-child(10) { animation-delay: 1.1s; }
        .terms-section:nth-child(11) { animation-delay: 1.2s; }
        .terms-section:nth-child(12) { animation-delay: 1.3s; }
        .terms-section:nth-child(13) { animation-delay: 1.4s; }
        
        .terms-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .terms-section h2 {
          font-size: 2rem;
          margin-bottom: 1.8rem;
          color: var(--gold);
          position: relative;
          letter-spacing: 1px;
        }
        
        .terms-section h2:after {
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
        
        .terms-section:hover h2:after {
          width: 100px;
        }
        
        .terms-section h3 {
          font-size: 1.4rem;
          margin-top: 1.8rem;
          margin-bottom: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.5px;
        }
        
        .terms-section p {
          margin-bottom: 1.4rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 300;
          font-size: 1.05rem;
        }
        
        .terms-section ul {
          padding-left: 1.8rem;
          margin-bottom: 1.8rem;
        }
        
        .terms-section li {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 300;
          position: relative;
          padding-left: 0.5rem;
        }
        
        .terms-section li::marker {
          color: var(--gold);
        }
        
        .terms-section strong {
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
          .terms-content {
            padding: 3rem 1.5rem;
          }
        }
        
        @media (max-width: 992px) {
          .terms-layout {
            flex-direction: column;
            gap: 2rem;
          }
          
          .terms-nav {
            position: relative;
            top: 0;
            flex: none;
            width: 100%;
            margin-bottom: 2rem;
          }
          
          .terms-title {
            font-size: 3.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .header-container {
            margin-bottom: 3rem;
            padding-top: 2rem;
          }
          
          .terms-title {
            font-size: 2.8rem;
          }
          
          .terms-section h2 {
            font-size: 1.8rem;
          }
          
          .terms-text {
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .terms-title {
            font-size: 2.2rem;
          }
          
          .terms-section h2 {
            font-size: 1.5rem;
          }
          
          .terms-section h3 {
            font-size: 1.3rem;
          }
          
          .terms-section p, 
          .terms-section li {
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

export default TermsOfService;
