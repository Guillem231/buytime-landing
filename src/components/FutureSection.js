import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const FutureSection = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const connectionRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [matchActive, setMatchActive] = useState(false);
  
  // Datos de servicios para la animación automática
  const services = [
    { 
      request: "a chef for tonight", 
      matches: [
        { name: "Maria C.", rating: 5, service: "Professional Chef", availability: "Available today" },
        { name: "John D.", rating: 4, service: "Home Cooking Expert", availability: "Available tomorrow" }
      ]
    },
    { 
      request: "house cleaning", 
      matches: [
        { name: "Elena T.", rating: 5, service: "Premium Cleaning", availability: "Available today" },
        { name: "Robert M.", rating: 5, service: "Deep Clean Expert", availability: "Available in 2 hours" }
      ]
    },
    { 
      request: "dog walking", 
      matches: [
        { name: "James K.", rating: 4, service: "Pet Care Professional", availability: "Available now" },
        { name: "Sarah L.", rating: 5, service: "Certified Dog Trainer", availability: "Available today" }
      ]
    },
    { 
      request: "grocery delivery", 
      matches: [
        { name: "Michael P.", rating: 5, service: "Express Shopper", availability: "Ready in 1 hour" },
        { name: "Anna D.", rating: 5, service: "Personal Shopper", availability: "Available now" }
      ]
    }
  ];
  
  // Initialize connection particles
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Create particles with improved visual effects
    const createParticles = () => {
      const particleCount = 2000; // More particles for richer visual
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const velocity = new Float32Array(particleCount * 3);
      
      // Gold color palette - enhanced with more variation
      const colorPalette = [
        new THREE.Color('#FFD700'), // Gold
        new THREE.Color('#F5F5F5'), // White smoke
        new THREE.Color('#D4AF37'), // Metallic gold
        new THREE.Color('#FFC107'), // Amber
        new THREE.Color('#FFFFFF'), // Pure white for highlight
        new THREE.Color('#E6C200')  // Darker gold
      ];
      
      // Generate particles along multiple curved paths for a richer connection
      const connectionPaths = [];
      
      // Main curved path
      const mainCurvePoints = [];
      for (let i = 0; i < 7; i++) {
        const t = i / 6;
        const x = -2 + t * 4; // From left (-2) to right (2)
        const y = Math.sin(t * Math.PI) * 0.5; // Curve up and down
        const z = 0;
        mainCurvePoints.push(new THREE.Vector3(x, y, z));
      }
      connectionPaths.push(new THREE.CatmullRomCurve3(mainCurvePoints));
      
      // Secondary paths with slight variations
      for (let j = 0; j < 3; j++) {
        const curvePoints = [];
        for (let i = 0; i < 7; i++) {
          const t = i / 6;
          const x = -2 + t * 4;
          const y = Math.sin(t * Math.PI) * (0.4 + j * 0.15);
          const z = 0.1 * (j - 1);
          curvePoints.push(new THREE.Vector3(x, y, z));
        }
        connectionPaths.push(new THREE.CatmullRomCurve3(curvePoints));
      }
      
      for (let i = 0; i < particleCount; i++) {
        // Select a random path
        const pathIndex = Math.floor(Math.random() * connectionPaths.length);
        const curve = connectionPaths[pathIndex];
        
        // Position particles along curve with some randomness
        const t = Math.random();
        const curvePos = curve.getPoint(t);
        const randomOffset = new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        );
        
        const pos = curvePos.clone().add(randomOffset);
        
        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;
        
        // Assign velocity - particles flow from left to right
        velocity[i * 3] = 0.005 + Math.random() * 0.01;
        velocity[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
        velocity[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
        
        // Random color from palette with weighted distribution
        const colorIndex = Math.random() > 0.7 
          ? Math.floor(Math.random() * 2) + 4 // 30% chance for highlight colors
          : Math.floor(Math.random() * 4);     // 70% chance for main colors
        
        const color = colorPalette[colorIndex];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        // Size variation for depth effect
        sizes[i] = Math.random() * 3 + (Math.random() > 0.9 ? 3 : 1); // Some larger particles
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      // Custom shader material for enhanced particles
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          flowActive: { value: 0 },
          flowDirection: { value: 1 } // 1 for normal, -1 for reverse
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          uniform float time;
          uniform float flowActive;
          uniform float flowDirection;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            
            // Base position
            vec3 pos = position;
            
            // Flow animation - particles move from left to right or right to left
            if (flowActive > 0.5) {
              pos.x += time * 0.3 * flowDirection;
              
              // Reset particles when they go off-screen
              if (flowDirection > 0.0 && pos.x > 2.5) {
                pos.x = -2.5;
              } else if (flowDirection < 0.0 && pos.x < -2.5) {
                pos.x = 2.5;
              }
              
              // Add wave motion
              pos.y += sin(pos.x * 3.0 + time) * 0.05;
            } else {
              // Subtle movement when flow not active
              pos.x += sin(time * 0.5 + pos.y * 5.0) * 0.01;
              pos.y += cos(time * 0.5 + pos.x * 5.0) * 0.01;
            }
            
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
            
            // Enhance glow effect
            float glow = 1.0 - smoothstep(0.0, 0.5, dist);
            vec3 finalColor = vColor * glow;
            
            // Add brighter center
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
    
    const particles = createParticles();
    
    // Animation loop with pulse/flow effects
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      const time = performance.now() * 0.001;
      
      // Update particle material uniforms
      if (particles && particles.material.uniforms) {
        particles.material.uniforms.time.value = time;
        
        // Activate flow when section is visible
        if (isVisible) {
          // Fade in the flow
          particles.material.uniforms.flowActive.value += (1.0 - particles.material.uniforms.flowActive.value) * 0.01;
          
          // Change flow direction based on match state
          const targetDirection = matchActive ? -1.0 : 1.0;
          particles.material.uniforms.flowDirection.value += 
            (targetDirection - particles.material.uniforms.flowDirection.value) * 0.05;
        } else {
          // Fade out the flow
          particles.material.uniforms.flowActive.value *= 0.98;
        }
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current) return;
      
      const canvas = canvasRef.current;
      const renderer = rendererRef.current;
      
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      scene.remove(particles);
      particles.geometry.dispose();
      particles.material.dispose();
      renderer.dispose();
    };
  }, [isVisible, matchActive]);
  
  // Auto-cycle through services and matches
  useEffect(() => {
    if (!isVisible) return;
    
    // Service cycling interval
    const serviceCycleInterval = setInterval(() => {
      setActiveService(prev => (prev + 1) % services.length);
      
      // Reset match state
      setMatchActive(false);
      
      // After small delay, show match result
      setTimeout(() => {
        setMatchActive(true);
      }, 1800);
    }, 6000); // Change service every 6 seconds
    
    return () => {
      clearInterval(serviceCycleInterval);
    };
  }, [isVisible, services.length]);
  
  // Handle scroll animations and visibility
  useEffect(() => {
    // Set initial states of elements
    gsap.set('.section-title', { opacity: 0, y: 30 });
    gsap.set('.time-card', { opacity: 0, y: 50, rotationX: -10 });
    gsap.set('.platform-stats', { opacity: 0, y: 30 });
    gsap.set('.connection-container', { opacity: 0 });
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      end: "bottom top",
      onEnter: () => {
        setIsVisible(true);
        
        // Title animation
        gsap.to('.section-title', {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        });
        
        // Cards animation with stagger
        gsap.to('.time-card', {
          opacity: 1,
          y: 0,
          rotationX: 0,
          stagger: 0.3,
          duration: 1.2,
          ease: "back.out(1.5)",
          onComplete: () => {
            // Start auto-cycling through services
            setActiveService(0);
            setTimeout(() => {
              setMatchActive(true);
            }, 1500);
          }
        });
        
        // Connection container
        gsap.to('.connection-container', {
          opacity: 1,
          duration: 1.5,
          delay: 0.5
        });
        
        // Platform stats
        gsap.to('.platform-stats', {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          delay: 1.2,
          ease: "power2.out"
        });
      },
      onLeaveBack: () => {
        setIsVisible(false);
      }
    });
    
    return () => {
      scrollTrigger.kill();
    };
  }, []);
  
  // Format rating to stars
  const formatRating = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };
  
  return (
    <section ref={sectionRef} className="future-section">
      <div className="section-title">
        <h2>The Future of Time</h2>
        <p className="subtitle">A marketplace that transforms your time into value</p>
      </div>
      
       <div className="time-transaction-container">
        <div className="time-card buyer">
          <div className="time-card-content">
            <h3>Time Buyer</h3>
            <div className="hologram-effect">
              <span className="need-text">I need...</span>
              <div className="typing-container">
                {services.map((service, index) => (
                  <div 
                    key={index} 
                    className={`typing-text ${index === activeService ? 'active' : ''}`}
                  >
                    {service.request}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="interaction-hint">
              <span className="hint-icon">⟳</span>
              <p>Automatically finding service matches...</p>
            </div>
          </div>
          
          <div className="card-glow"></div>
        </div>

        {/* <div className="connection-container">
          <canvas 
            ref={canvasRef} 
            className="connection-canvas"
          />
          
          <div className="value-proposition">
            <div className="platform-stats">
              <div className="stat">
                <span className="stat-number">1.2M+</span>
                <span className="stat-label">Active Providers</span>
              </div>
              
              <div className="stat">
                <span className="stat-number">30s</span>
                <span className="stat-label">Average Match Time</span>
              </div>
              
              <div className="stat">
                <span className="stat-number">4.8/5</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </div> */}

        <div className="time-card seller">
          <div className="time-card-content">
            <h3>Time Seller</h3>
            <div className={`service-matches ${matchActive ? 'active' : ''}`}>
              {services[activeService].matches.map((match, index) => (
                <div 
                  key={index} 
                  className="service-match"
                  style={{
                    transitionDelay: `${index * 0.2}s`
                  }}
                >
                  <div className="provider-info">
                    <span className="provider-name">{match.name}</span>
                    <div className="rating">{formatRating(match.rating)}</div>
                  </div>
                  <span className="service">{match.service}</span>
                  <div className="availability">
                    <span className="availability-dot"></span>
                    {match.availability}
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`match-confirmation ${matchActive ? 'active' : ''}`}>
              <button className="confirm-button">
                Select Provider
              </button>
            </div>
          </div>
          
          <div className="card-glow"></div>
        </div>
      </div>
      
      {/* Add this CSS directly in the component using <style jsx> */}
      <style jsx>{`
        .future-section {
          position: relative;
          min-height: 100vh;
          padding: 6rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: transparent;
          z-index: 1;
          overflow: hidden;
        }
        
        .section-title {
          margin-bottom: 4rem;
          text-align: center;
        }
        
        .section-title h2 {
          font-size: 4rem;
          font-weight: 800;
          background: linear-gradient(45deg, var(--gold) 0%, #FFF8DC 50%, var(--gold) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.3));
          letter-spacing: 2px;
          margin-bottom: 1rem;
        }
        
        .subtitle {
          font-size: 1.4rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 300;
        }
        
        .time-transaction-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          max-width: 1400px;
        }
        
        .time-card {
          position: relative;
          width: 380px;
          min-height: 450px;
          background: rgba(10, 10, 30, 0.7);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform-style: preserve-3d;
          perspective: 1000px;
          display: flex;
          flex-direction: column;
        }
        
        .time-card-content {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .time-card:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 255, 255, 0.05));
          border-radius: inherit;
          z-index: 0;
        }
        
        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.8s;
          z-index: 0;
        }
        
        .time-card h3 {
          font-size: 2rem;
          color: var(--gold);
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        
        .hologram-effect {
          margin-top: 1rem;
          position: relative;
          flex: 1;
        }
        
        .need-text {
          display: block;
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
        }
        
       .typing-container {
          height: 80px;
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2), inset 0 0 30px rgba(212, 175, 55, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        
        .typing-text {
          position: absolute;
          opacity: 0;
          visibility: hidden;
          font-size: 1.8rem;
          color: #ffffff;
          font-weight: 600;
          text-align: center;
          width: 100%;
          transform: translateY(20px);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .typing-text.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          animation: typewriter 1s steps(40, end);
        }
        
        .service-request {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          color: #ffffff;
          font-weight: 600;
        }
        
        .interaction-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 10px;
          animation: pulse 2s infinite ease-in-out;
        }
        
        .hint-icon {
          font-size: 1.5rem;
          margin-right: 0.5rem;
          animation: rotate 4s infinite linear;
        }
        
        .interaction-hint p {
          margin: 0;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .connection-container {
          position: relative;
          width: 400px;
          height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        
        .connection-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .value-proposition {
          position: relative;
          z-index: 1;
          width: 100%;
          text-align: center;
          padding: 1.5rem;
          background: rgba(10, 10, 30, 0.6);
          border-radius: 15px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .platform-stats {
          display: flex;
          justify-content: space-around;
          text-align: center;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
        }
        
        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 0.2rem;
        }
        
        .stat-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .service-matches {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
          min-height: 200px;
        }
        
        .service-match {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: translateY(30px);
          opacity: 0;
        }
        
        .service-matches.active .service-match {
          transform: translateY(0);
          opacity: 1;
        }
        
        .provider-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .provider-name {
          font-weight: 600;
          color: #ffffff;
        }
        
        .rating {
          color: var(--gold);
          font-size: 0.9rem;
        }
        
        .service {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95rem;
        }
        
        .availability {
          display: flex;
          align-items: center;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .availability-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4CAF50;
          margin-right: 6px;
          box-shadow: 0 0 10px #4CAF50;
          animation: pulse 1.5s infinite ease-in-out;
        }
        
        .match-confirmation {
          margin-top: 2rem;
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s ease;
          transition-delay: 0.5s;
        }
        
        .match-confirmation.active {
          opacity: 1;
          transform: translateY(0);
        }
        
        .confirm-button {
          background: linear-gradient(45deg, var(--gold) 0%, #FFC107 100%);
          color: rgba(0, 0, 0, 0.8);
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        }
        
        .confirm-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
        }
        
        .confirm-button:active {
          transform: translateY(1px);
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Card glow activation */
        .time-card:hover .card-glow, 
        .time-card:focus-within .card-glow {
          opacity: 1;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .time-transaction-container {
            flex-direction: column;
            gap: 3rem;
          }
          
          .time-card {
            width: 90%;
            max-width: 450px;
          }
          
          .connection-container {
            width: 90%;
            max-width: 450px;
            height: 200px;
            order: -1;
          }
          
          .section-title h2 {
            font-size: 3rem;
          }
        }
        
        @media (max-width: 768px) {
          .future-section {
            padding: 4rem 1rem;
          }
          
          .section-title h2 {
            font-size: 2.5rem;
          }
          
          .subtitle {
            font-size: 1.1rem;
          }
          
          .stat-number {
            font-size: 1.4rem;
          }
          
          .time-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default FutureSection;

