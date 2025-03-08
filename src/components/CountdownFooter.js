import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Link } from 'react-router-dom';


const CountdownFooter = () => {
  const canvasRef = useRef(null);
  const countdownRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
const prevTimeRef = useRef({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
});

  
  // Calculate time until July 1st
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(new Date().getFullYear(), 6, 1); // July is month 6 (0-indexed)
      const now = new Date();
      
      // If we're past July 1 of this year, target next year
      if (now > targetDate) {
        targetDate.setFullYear(targetDate.getFullYear() + 1);
      }
      
      const difference = targetDate - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        return { days, hours, minutes, seconds };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };
    
    // Update time every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    return () => clearInterval(timer);
  }, []);
  
  // 3D particle effect for the footer
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Canvas & renderer setup
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Create particles for the wave effect
    const createWaveParticles = () => {
      const particleCount = 1500;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      // Gold color palette
      const colorPalette = [
        new THREE.Color('#FFD700'), // Gold
        new THREE.Color('#F5F5F5'), // White smoke
        new THREE.Color('#D4AF37'), // Metallic gold
        new THREE.Color('#FFC107'), // Amber
        new THREE.Color('#FFFFFF'), // Pure white
        new THREE.Color('#E6C200')  // Darker gold
      ];
      
      // Create a wave of particles at the bottom of the footer
      for (let i = 0; i < particleCount; i++) {
        // Spread particles across width
        const x = (Math.random() - 0.5) * canvas.clientWidth * 0.05;
        
        // Particles mainly at the bottom with some variation
        const y = (Math.random() * 0.5 - 0.8) * 5;
        
        // Some depth variation
        const z = (Math.random() - 0.5) * 3;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // Random color from palette
        const colorIndex = Math.random() > 0.7 
          ? Math.floor(Math.random() * 2) + 4 // Highlight colors
          : Math.floor(Math.random() * 4);    // Main colors
        
        const color = colorPalette[colorIndex];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        // Size variation
        sizes[i] = Math.random() * 3 + (Math.random() > 0.9 ? 3 : 1);
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      // Custom shader material
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          uniform float time;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            
            // Base position
            vec3 pos = position;
            
            // Wave motion
            float waveX = sin(pos.x * 0.5 + time * 0.7) * 0.5;
            float waveY = cos(pos.z * 0.5 + time * 0.7) * 0.5;
            
            // Apply wave and rise effects
            pos.y += waveY;
            pos.x += waveX;
            
            // Optional: rise effect
            // pos.y += sin(time * 0.2) * 0.5;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (10.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            // Create circular particle with soft edge
            vec2 uv = gl_PointCoord.xy - 0.5;
            float dist = length(uv);
            if (dist > 0.5) discard;
            
            // Enhanced glow effect
            float glow = 1.0 - smoothstep(0.0, 0.5, dist);
            vec3 finalColor = vColor * glow;
            
            // Brighter center
            float centerGlow = 1.0 - smoothstep(0.0, 0.2, dist);
            finalColor += vColor * centerGlow * 0.5;
            
            gl_FragColor = vec4(finalColor, glow);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      
      return particles;
    };
    
    const particles = createWaveParticles();
    
    // Animation loop
    let animationId = null;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const time = performance.now() * 0.001;
      
      // Update shader time uniform for wave animation
      if (particles && particles.material.uniforms) {
        particles.material.uniforms.time.value = time;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      
      // Update sizes
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      // Update camera
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      // Update renderer
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (particles) {
        scene.remove(particles);
        particles.geometry.dispose();
        particles.material.dispose();
      }
      renderer.dispose();
    };
  }, []);
  
useEffect(() => {
  // Selección de elementos individuales
  const daysEl = countdownRef.current.querySelector('.days-value');
  const hoursEl = countdownRef.current.querySelector('.hours-value');
  // etc...
  
  // Verificaciones condicionales
  if (timeLeft.days !== prevTimeRef.current.days && daysEl) {
    gsap.fromTo(daysEl, { y: -10, opacity: 0.3 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
  }

  prevTimeRef.current = { ...timeLeft };
}, [timeLeft]);


  
  // Format time units with leading zeros
  const formatTimeUnit = (unit) => {
    return unit < 10 ? `0${unit}` : unit;
  };

  return (
    <footer className="countdown-footer">
      <canvas 
        ref={canvasRef}
        className="footer-canvas"
      />
      
       <div className="footer-content">
        <div className="countdown-container">
          <h3 className="countdown-title">Launching July 1st</h3>
          
          <div ref={countdownRef} className="countdown-timer">
            <div className="countdown-unit">
              <div className="countdown-value days-value">{formatTimeUnit(timeLeft.days)}</div>
              <div className="countdown-label">Days</div>
            </div>
            
            <div className="countdown-separator">:</div>
            
            <div className="countdown-unit">
              <div className="countdown-value hours-value">{formatTimeUnit(timeLeft.hours)}</div>
              <div className="countdown-label">Hours</div>
            </div>
            
            <div className="countdown-separator">:</div>
            
            <div className="countdown-unit">
              <div className="countdown-value minutes-value">{formatTimeUnit(timeLeft.minutes)}</div>
              <div className="countdown-label">Minutes</div>
            </div>
            
            <div className="countdown-separator">:</div>
            
            <div className="countdown-unit">
              <div className="countdown-value seconds-value">{formatTimeUnit(timeLeft.seconds)}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>
          
<div className="subscribe-container">

  <div className="contact-options">
    <a href="mailto:pedret.guillem@gmail.com" className="email-contact-button">
      <i className="far fa-envelope"></i> Send us an email
    </a>
  </div>
</div>

        </div>

        
        <div className="footer-bottom">
          <div className="copyright">
            © {new Date().getFullYear()} BuyTime. All rights reserved.
                  </div>
                  <div className="social-links">
            <a href="#" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
          
                  <div className="legal-links">
                
<a href="/privacy-policy" className="legal-link">Privacy Policy</a>
<a href="/terms-of-service" className="legal-link">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .countdown-footer {
          position: relative;
          min-height: 500px;
          background: linear-gradient(to bottom, rgba(10, 10, 30, 0.5), rgba(10, 10, 30, 0.95));
          color: #fff;
          overflow: hidden;
          border-top: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .footer-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .footer-content {
          position: relative;
          z-index: 2;
          padding: 4rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        
        .countdown-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .countdown-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 2rem;
          background: linear-gradient(45deg, var(--gold) 0%, #FFF8DC 50%, var(--gold) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.3));
        }
        
        .countdown-timer {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2.5rem;
          background: rgba(0, 0, 0, 0.8);
          padding: 2rem 3rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.2);
          overflow: hidden;
        }
        
        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 0.5rem;
          min-width: 80px;
          position: relative;
        }
        
        .countdown-value {
          font-size: 3.5rem;
          font-weight: 700;
          color: var(--gold);
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
          position: relative;
          font-family: 'Montserrat', sans-serif;
          line-height: 1;
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        
        .countdown-value:after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, var(--gold), transparent);
          opacity: 0.6;
        }
        
        .countdown-label {
          font-size: 0.9rem;
          margin-top: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 300;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        
        .countdown-separator {
          font-size: 2.5rem;
          color: rgba(212, 175, 55, 0.6);
          margin: 0 0.2rem;
          display: flex;
          align-items: flex-start;
          padding-top: 1rem;
        }
        .subscribe-container {
          margin-top: 1rem;
          text-align: center;
          width: 100%;
          max-width: 600px;
        }
        
        .subscribe-container p {
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
        }
        
        .subscribe-form {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
        }
        
        .email-input {
          flex: 1;
          max-width: 350px;
          padding: 0.8rem 1.2rem;
          border-radius: 30px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          background: rgba(0, 0, 0, 0.2);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }
        
        .email-input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        
        .email-contact-button {
          background: linear-gradient(45deg, var(--gold) 0%, #FFC107 100%);
          color: rgba(0, 0, 0, 0.8);
          margin-bottom: 2rem;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
        }
        
        .email-contact-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
        }
        
        .footer-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer-links {
          display: flex;
          gap: 2rem;
        }
        
        .footer-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 1rem;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .footer-link:after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--gold);
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: right;
        }
        
        .footer-link:hover {
          color: var(--gold);
        }
        
        .footer-link:hover:after {
          transform: scaleX(1);
          transform-origin: left;
        }
        
        .social-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          text-decoration: none;
          font-size: 1.2rem;
        }
        
        .social-link:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: var(--gold);
          color: var(--gold);
          transform: translateY(-3px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
        }
        
        .footer-bottom {
          display: flex;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem 0;

          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }
        
        .copyright {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }
        
        .legal-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .legal-link {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }
        
        .legal-link:hover {
          color: var(--gold);
        }
        
        /* 3D hover effects for countdown units */
        .countdown-unit:hover .countdown-value {
          transform: translateY(-5px);
          text-shadow: 0 10px 20px rgba(212, 175, 55, 0.6);
          transition: all 0.3s ease;
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .countdown-timer {
            padding: 1.5rem;
          }
          
          .countdown-unit {
            min-width: 60px;
            margin: 0 0.3rem;
          }
          
          .countdown-value {
            font-size: 2.5rem;
          }
          
          .countdown-label {
            font-size: 0.7rem;
          }
          
          .countdown-separator {
            font-size: 2rem;
          }
          
          .footer-nav {
            flex-direction: column;
            gap: 2rem;
          }
          
          .footer-links {
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
        
        @media (max-width: 576px) {
          .countdown-timer {
            flex-wrap: wrap;
            gap: 1rem;
            padding: 1rem;
          }
          
          .countdown-title {
            font-size: 2rem;
          }
          
          .subscribe-form {
            flex-direction: column;
            align-items: center;
          }
          
          .email-input {
            width: 100%;
            max-width: 100%;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default CountdownFooter;

