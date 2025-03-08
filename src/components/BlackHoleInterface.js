import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const BlackHoleInterface = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const blackHoleRef = useRef(null);
  const particlesRef = useRef(null);
  const animationFrameRef = useRef(null);
  const textInputRef = useRef(null);
  
  const [interactionState, setInteractionState] = useState('prompt'); // idle, prompt, inputting, processing, response
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [inputMethod, setInputMethod] = useState(null); // null, 'text', 'voice'
  const [recording, setRecording] = useState(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);
const [vignetteFade, setVignetteFade] = useState(0.15);
const observerRef = useRef(null);
const [isVisible, setIsVisible] = useState(false);
const [scrollProgress, setScrollProgress] = useState(0);
const [typewriterText, setTypewriterText] = useState("");
const fullText = "What service would you like to hire?";

// Collection of extremely sarcastic, arrogant responses for any service request
const responses = [
  "Oh, you want to hire services? Bold of you to assume anyone would waste their talents on your insignificant needs.",
  
  "Your service request has been evaluated and properly categorized under 'Laughably Beneath Our Standards'.",
  
  "I'd connect you with a service provider, but I can't in good conscience subject another human to... well, you.",
  
  "Your request would be adorable if it wasn't so pathetically basic. Do you also need help tying your shoes?",
  
  "I've analyzed thousands of service requests, and congratulations - yours just set a new low bar.",
  
  "The algorithm specifically designed to match clients with services just crashed trying to find someone desperate enough to help you.",
  
  "You're seriously asking for this service? Perhaps aim for something more aligned with your... limited capabilities.",
  
  "I could process your request, but why enable your remarkable talent for wasting other people's time?",
  
  "Your service needs are as sophisticated as a toddler's art project - messy, pointless, and only impressive to yourself.",
  
  "That's what you want to spend money on? Your financial decisions explain so much about your... current situation.",
  
  "Our premium providers are reserved for clients who can appreciate quality. May I suggest the bargain basement section instead?",
  
  "I've forwarded your request to our 'Special Cases' department, which is just a paper shredder with a fancy label.",
  
  "The service you're requesting requires a minimum competence level that, unfortunately, you haven't demonstrated.",
  
  "I'll add your request to our priority list, right below 'Clean the lint trap' and just above 'Watch paint dry'.",
  
  "Our service providers have standards, darling. Standards that your request fails to meet on every measurable metric."
];

  // Initialize 3D scene
  useEffect(() => {
    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Set up renderer with high resolution
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    
    // Set size to a more defined circle shape
    const size = Math.min(window.innerWidth * 0.35, 400);
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    
    // Create black hole
    const createBlackHole = () => {
      // Black hole material with advanced shader
      const blackHoleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          resolution: { value: new THREE.Vector2(size, size) },
          intensity: { value: 1.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec2 resolution;
          uniform float intensity;
          varying vec2 vUv;
          
          float sdCircle(vec2 p, float r) {
            return length(p) - r;
          }
          
          void main() {
            // Center-oriented coordinates
            vec2 uv = vUv * 2.0 - 1.0;
            
            // Circular distance from center
            float dist = length(uv);
            x
            // Space distortion (gravitational lensing effect)
            float angle = atan(uv.y, uv.x);
            float distortion = 0.4 / (dist + 0.1);
            vec2 warpedUV = vec2(
              uv.x + cos(angle) * distortion * sin(time * 0.5) * intensity,
              uv.y + sin(angle) * distortion * sin(time * 0.5) * intensity
            );
            
            // Black hole center (event horizon) - deeper black
            float blackHoleRadius = 0.35;
            float blackHoleEdge = blackHoleRadius + 0.05;
            float blackHole = smoothstep(blackHoleRadius, blackHoleEdge, length(warpedUV));
            
            // Darker border around the event horizon
            float border = smoothstep(blackHoleRadius - 0.05, blackHoleRadius, length(warpedUV)) * 
                         (1.0 - smoothstep(blackHoleRadius, blackHoleRadius + 0.1, length(warpedUV)));
            
            // Accretion disk - more defined
            float innerRing = blackHoleRadius + 0.02;
            float outerRing = innerRing + 0.3;
            float ringDist = length(warpedUV);
            float ring = smoothstep(outerRing, outerRing - 0.08, ringDist) *
                         smoothstep(innerRing - 0.02, innerRing, ringDist);
            
            // Enhanced ring variations
            ring *= (0.7 + 0.3 * sin(angle * 20.0 + time));
            
            // Swirling effect on the ring
            float swirl = sin(angle * 15.0 - time * 3.0) * 0.5 + 0.5;
            ring *= (0.8 + swirl * 0.4);
            
            // Gold color for the ring (D4AF37)
            vec3 goldColor = vec3(0.83, 0.69, 0.22);
            // Deep gold for inner parts
            vec3 deepGold = vec3(0.7, 0.5, 0.1);
            // White with slight gold tint
            vec3 whiteGold = vec3(1.0, 0.97, 0.84);
            // Deep black for the hole
            vec3 blackColor = vec3(0.0, 0.0, 0.0);
            
            // Stronger color mixing
            float colorMix = 0.6 + 0.4 * sin(angle * 8.0 + time);
            vec3 ringColor = mix(deepGold, goldColor, colorMix);
            
            // Add more pronounced white highlights
            float highlight = pow(swirl, 2.0);
            ringColor = mix(ringColor, whiteGold, highlight * 0.9);
            
            // Enhanced glow effect
            float glow = 0.03 / (pow(dist, 1.2) + 0.01);
            vec3 glowColor = mix(whiteGold, goldColor, dist) * glow * (0.7 + 0.3 * sin(time * 0.2));
            
            // Add more visible gold sparks in the ring
            float sparkTime = time * 4.0;
            float sparkAngle = mod(angle + sparkTime, 6.28);
            float sparkLen = mod(dist * 12.0 + sparkTime, 6.28);
            float sparkle = pow(sin(sparkAngle * 10.0) * sin(sparkLen * 10.0), 20.0) * ring * 3.0;
            
            // Combine effects
            vec3 finalColor = ringColor * ring + glowColor + whiteGold * sparkle;
            
            // Add intensity variation over time
            finalColor *= intensity * (0.8 + 0.2 * sin(time * 0.3));
            
            // Make the black hole truly black
            finalColor = mix(blackColor, finalColor, blackHole);
            
            // Add gold border to the event horizon
            finalColor = mix(deepGold, finalColor, 1.0 - border * 0.7);
            
            // Stronger alpha for better visibility against backgrounds
            float blackHoleAlpha = 1.0 - blackHole * 0.5; // Cambiado de 0.97 a 0.5 para menos transparencia
            float ringAlpha = ring + min(glow, 0.8) + sparkle;
            float alpha = max(blackHoleAlpha, ringAlpha);

            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
      });
      
      const blackHoleGeometry = new THREE.CircleGeometry(1.8, 64);
      const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
      blackHoleRef.current = blackHole;
      scene.add(blackHole);
      
      return blackHole;
    };
      
    
const createParticleSystem = () => {
  const particleCount = 15000;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  const particleColors = new Float32Array(particleCount * 3);
  const particleVelocities = [];
  
  for (let i = 0; i < particleCount; i++) {
    const isOrbitalParticle = Math.random() < 0.7;
    
    if (isOrbitalParticle) {
      const radius = 1.5 + Math.random() * 3.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() * 0.2 + 0.9) * Math.PI / 2;
      
      const verticalOffset = (Math.random() * 0.2 - 0.1) * radius;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = verticalOffset;
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
      
      particleVelocities.push({
        orbitSpeed: (Math.random() * 0.01 + 0.02) * (radius < 2 ? 1.5 : 1),
        orbitRadius: radius,
        orbitAngle: theta,
        orbitPlane: 'vertical',
        orbitTilt: phi,
        pulseSpeed: Math.random() * 0.5 + 0.2
      });
      
      const goldIntensity = Math.random() * 0.4 + 0.8;
      particleColors[i * 3] = goldIntensity * 0.83;
      particleColors[i * 3 + 1] = goldIntensity * 0.69;
      particleColors[i * 3 + 2] = goldIntensity * 0.22;
      
      particleSizes[i] = Math.random() * 1.8 + 0.6;
    } else {
      const radius = (2.5 + Math.random() * 4.0);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
      
      particleVelocities.push({
        orbitSpeed: (Math.random() * 0.005) + 0.001,
        orbitRadius: radius,
        orbitAngle: theta,
        orbitPlane: 'spherical',
        orbitTilt: phi,
        pulseSpeed: Math.random() * 0.5 + 0.2
      });
      
      const goldIntensity = Math.random() * 0.2 + 0.4;
      particleColors[i * 3] = goldIntensity * 0.83;
      particleColors[i * 3 + 1] = goldIntensity * 0.69;
      particleColors[i * 3 + 2] = goldIntensity * 0.22;
      
      particleSizes[i] = Math.random() * 0.8 + 0.3;
    }
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
  
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      intensity: { value: 0.7 }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      uniform float time;
      uniform float intensity;
      varying vec3 vColor;
      
      void main() {
        vColor = color;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        float pulseFactor = 1.0 + 0.15 * sin(time + length(position) * 0.5);
        
        float dist = length(mvPosition.xyz);
        gl_PointSize = size * (20.0 / dist) * intensity * pulseFactor;
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      
      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float dist = length(uv);
        
        if (dist > 0.48) discard;
        
        float centerIntensity = 1.0 - smoothstep(0.0, 0.2, dist);
        float edgeIntensity = 1.0 - smoothstep(0.1, 0.48, dist);
        
        vec3 goldColor = vec3(0.83, 0.69, 0.22);
        vec3 whiteColor = vec3(1.0, 0.98, 0.9);
        
        vec3 finalColor = mix(
          mix(vColor * goldColor, whiteColor, centerIntensity), 
          vColor, 
          0.3
        );
        
        float alpha = edgeIntensity * 0.9;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    blending: THREE.NormalBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.userData = { velocities: particleVelocities };
  particlesRef.current = particles;
  scene.add(particles);

  return particles;
};

    // Create scene elements
    const blackHole = createBlackHole();
    const particles = createParticleSystem();
    
    // Animation loop
const animate = () => {
  animationFrameRef.current = requestAnimationFrame(animate);
  
  const time = performance.now() * 0.001;
  
  if (blackHole.material.uniforms) {
    blackHole.material.uniforms.time.value = time;
  }
  
  if (particles && particles.geometry && particles.userData.velocities) {
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.userData.velocities;
    
    for (let i = 0; i < velocities.length; i++) {
      const i3 = i * 3;
      const v = velocities[i];
      
      v.orbitAngle += v.orbitSpeed;
      
      if (v.orbitPlane === 'horizontal') {
        positions[i3] = v.orbitRadius * Math.cos(v.orbitAngle);
        positions[i3 + 1] = positions[i3 + 1] * 0.99 + Math.sin(time * 0.2 + v.orbitAngle) * 0.01;
        positions[i3 + 2] = v.orbitRadius * Math.sin(v.orbitAngle);
        
        if (v.orbitRadius < 2.5) {
          v.orbitRadius = v.orbitRadius * 0.9999;
          
          if (v.orbitRadius < 0.8) {
            v.orbitRadius = 3.0 + Math.random() * 1.0;
            v.orbitSpeed = (Math.random() * 0.01 + 0.01);
          }
        }
      } else {
        positions[i3] = v.orbitRadius * Math.sin(v.orbitTilt) * Math.cos(v.orbitAngle);
        positions[i3 + 1] = v.orbitRadius * Math.sin(v.orbitTilt) * Math.sin(v.orbitAngle);
        positions[i3 + 2] = v.orbitRadius * Math.cos(v.orbitTilt);
      }
      
      const pulse = Math.sin(time * v.pulseSpeed) * 0.03;
      positions[i3] *= (1 + pulse);
      positions[i3 + 1] *= (1 + pulse);
      positions[i3 + 2] *= (1 + pulse);
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    
    if (particles.material.uniforms) {
      particles.material.uniforms.time.value = time;
      
      if (interactionState === 'processing') {
        particles.material.uniforms.intensity.value = 2.0 + Math.sin(time * 5) * 0.5;
      } else if (interactionState === 'response') {
        particles.material.uniforms.intensity.value = 1.8;
      } else {
        particles.material.uniforms.intensity.value = 1.4 + Math.sin(time * 0.5) * 0.2;
      }
    }
  }
  
  scene.rotation.y = Math.sin(time * 0.1) * 0.1;
  scene.rotation.x = Math.sin(time * 0.15) * 0.05;
  
  renderer.render(scene, camera);
};

    animate();
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Maintain aspect ratio for the canvas
      const size = Math.min(width * 0.6, height * 0.6);
      
      if (canvasRef.current) {
        canvasRef.current.width = size;
        canvasRef.current.height = size;
      }
      
      if (rendererRef.current) {
        rendererRef.current.setSize(size, size);
      }
      
      if (cameraRef.current) {
        cameraRef.current.aspect = 1;
        cameraRef.current.updateProjectionMatrix();
      }
      
      if (blackHoleRef.current && blackHoleRef.current.material.uniforms) {
        blackHoleRef.current.material.uniforms.resolution.value.set(size, size);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      
      // Clean up Three.js
      if (blackHoleRef.current) {
        if (blackHoleRef.current.geometry) blackHoleRef.current.geometry.dispose();
        if (blackHoleRef.current.material) blackHoleRef.current.material.dispose();
        scene.remove(blackHoleRef.current);
      }
      
      if (particlesRef.current) {
        if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
        if (particlesRef.current.material) particlesRef.current.material.dispose();
        scene.remove(particlesRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      // Clear references
      sceneRef.current = null;
      cameraRef.current = null;
      blackHoleRef.current = null;
      particlesRef.current = null;
      rendererRef.current = null;
    };
  }, []);
    // Primer useEffect nuevo para el IntersectionObserver
useEffect(() => {
  // Save the original background color
  const originalBackground = window.getComputedStyle(document.body).backgroundColor;
  
  const handleIntersection = (entries) => {
    const entry = entries[0];
    setIsVisible(entry.isIntersecting);
    
    // Calculate how much of the element is visible
    if (entry.isIntersecting) {
      const viewportHeight = window.innerHeight;
      const boundingRect = entry.boundingClientRect;
      
      // Calculate how far into the viewport the element is
      let visiblePortion = 0;
      
      if (boundingRect.top < 0) {
        // Element starts above viewport
        const visibleHeight = Math.min(boundingRect.bottom, viewportHeight);
        visiblePortion = visibleHeight / boundingRect.height;
      } else if (boundingRect.bottom > viewportHeight) {
        // Element extends below viewport
        const visibleHeight = viewportHeight - boundingRect.top;
        visiblePortion = visibleHeight / boundingRect.height;
      } else {
        // Element fully visible
        visiblePortion = 1;
      }
      
      // Clamp between 0 and 1
      visiblePortion = Math.max(0, Math.min(1, visiblePortion));
      setScrollProgress(visiblePortion);
      
      // Apply background color change based on visibility
      const opacity = visiblePortion * 0.3; // Max opacity 0.95
      document.body.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
      document.body.style.transition = 'background-color 0.3s ease';
    } else {
      // Restore original background when element not visible
      document.body.style.backgroundColor = originalBackground;
    }
  };
  
  const observer = new IntersectionObserver(handleIntersection, {
    root: null, // Use viewport as root
    rootMargin: '0px',
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] // Track multiple thresholds for smoother transition
  });
  
  if (containerRef.current) {
    observer.observe(containerRef.current);
    observerRef.current = observer;
  }
  
  return () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    // Restore original background on unmount
    document.body.style.backgroundColor = originalBackground;
  };
}, []);
// Añade este useEffect después de tus otros useEffects
useEffect(() => {
  if (interactionState === 'prompt') {
    // Reinicia explícitamente el texto
    setTypewriterText("");
    
    // Pequeña pausa antes de comenzar a escribir
    const startDelay = setTimeout(() => {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypewriterText(current => fullText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 50);
      
      return () => {
        clearInterval(typingInterval);
        clearTimeout(startDelay);
      };
    }, 300);
    
    return () => clearTimeout(startDelay);
  }
}, [interactionState]);


// Segundo useEffect nuevo para refinamiento con scroll
useEffect(() => {
  const handleScroll = () => {
    if (!containerRef.current || !isVisible) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate how far the element has been scrolled through
    let progress = 0;
    
    if (rect.top <= 0 && rect.bottom >= viewportHeight) {
      // Element covers the whole viewport
      progress = 1;
    } else if (rect.top < viewportHeight && rect.bottom > 0) {
      // Element partially visible
      const totalHeight = rect.height + viewportHeight;
      const visibleHeight = viewportHeight - Math.max(0, rect.top) - Math.max(0, viewportHeight - rect.bottom);
      progress = visibleHeight / Math.min(rect.height, viewportHeight);
    }
    
    progress = Math.max(0, Math.min(1, progress));
    setScrollProgress(progress);
    
    // Apply background color with smooth transition
    const opacity = progress * 0.95;
    document.body.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
  };
  
  window.addEventListener('scroll', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [isVisible]);

  
const handleBlackHoleClick = () => {
  if (interactionState === 'idle') {
    setInteractionState('prompt');
    setVignetteFade(0.25);
    if (blackHoleRef.current && blackHoleRef.current.material.uniforms) {
      gsap.to(blackHoleRef.current.material.uniforms.intensity, {
        value: 1.8,
        duration: 0.8,
        ease: "power2.inOut"
      });
    }
    // Force the background to be fully black during interaction
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    setBackgroundOpacity(0.95);

    document.body.style.transition = 'background-color 2s ease';
  }
};

  
  const selectInputMethod = (method) => {
    setInputMethod(method);
    setInteractionState('inputting');
    
    // Focus text input if text method chosen
    if (method === 'text' && textInputRef.current) {
      setTimeout(() => {
        textInputRef.current.focus();
      }, 100);
    } else if (method === 'voice') {
      startVoiceRecording();
    }
  };
  
  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser doesn't support voice recognition. Try Chrome or Edge.");
      setInputMethod('text');
      return;
    }
    
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    setRecording(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setRecording(false);
      
      // Auto-submit after voice input
      setTimeout(() => {
        processInput(transcript);
      }, 500);
    };
    
    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      setRecording(false);
      setInputText("I couldn't understand what you said...");
      setInputMethod('text');
    };
    
    recognition.onend = () => {
      setRecording(false);
    };
    
    recognition.start();
  };
  
  const processInput = (text = inputText) => {
    if (!text.trim()) return;
    
    setInteractionState('processing');
    
    // Animate black hole for processing effect
    if (blackHoleRef.current && blackHoleRef.current.material.uniforms) {
      gsap.to(blackHoleRef.current.material.uniforms.intensity, {
        value: 2.0,
        duration: 1.2,
        ease: "power2.inOut"
      });
    }
    
    // Simulate processing time for dramatic effect
    setTimeout(() => {
      // Get random sarcastic response
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setResponseText(randomResponse);
      setInteractionState('response');
      
      // Reset black hole intensity after showing response
      if (blackHoleRef.current && blackHoleRef.current.material.uniforms) {
        gsap.to(blackHoleRef.current.material.uniforms.intensity, {
          value: 1.3,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    }, 2000);
  };


  
    const resetInterface = () => {
const opacity = scrollProgress * 0.95;
document.body.style.transition = 'background-color 1s ease';
document.body.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
setBackgroundOpacity(opacity);

  // Return to idle state
  setInteractionState('prompt');
  setInputText('');
  setResponseText('');
  setInputMethod(null);
  
  // Reset black hole intensity
  if (blackHoleRef.current && blackHoleRef.current.material.uniforms) {
    gsap.to(blackHoleRef.current.material.uniforms.intensity, {
      value: 1.0,
      duration: 0.8,
      ease: "power2.inOut"
    });
  }
  
  // Revertir el fondo de toda la página
  document.body.style.transition = 'background-color 2s ease';
  document.body.style.backgroundColor = '';
};
  
  // Handle form submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    processInput();
  };
  
  return (
    <div
      ref={containerRef}
      className="black-hole-interface"
      style={{
        width: '100%',
        minHeight: '80vh',
          display: 'flex',
        
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '4rem 0',
      }}
    >
      <div 
        className="black-hole-container"
        onClick={interactionState === 'idle' ? handleBlackHoleClick : undefined}
        style={{
          position: 'relative',
          cursor: interactionState === 'idle' ? 'pointer' : 'default',
          zIndex: 10,
          margin: '2rem 0',
          transition: 'transform 0.5s ease',
          transform: `scale(${interactionState !== 'idle' ? 0.9 : 1})`
        }}
      >
        <canvas 
          ref={canvasRef} 
          style={{
            display: 'block',
            borderRadius: '50%'
          }}
        />
        
        {interactionState === 'idle' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center',
            background: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
            padding: '2rem',
            pointerEvents: 'none',
            animation: 'pulse 4s infinite ease-in-out'
          }}>
            <div style={{
              fontSize: '0.9rem',
              opacity: 0.8,
              letterSpacing: '2px'
            }}>
              CLICK TO INTERACT
            </div>
          </div>
        )}
      </div>
      
      {interactionState === 'prompt' && (
  <div style={{
    maxWidth: '500px',
    textAlign: 'center',
    color: 'white',
    animation: 'fadeIn 0.5s ease-out'
  }}>
  <div 
  style={{
    width: '100%',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(0,0,0,0.8)',
    color: 'white',
    boxShadow: '0 5px 20px rgba(212, 175, 55, 0.2)',
    borderColor: 'rgba(212, 175, 55, 0.4)',
    textAlign: 'center',
    marginBottom: '2rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  }}

>
       <p style={{
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: '300',
        letterSpacing: '1px',
        minHeight: '1.7rem' 
      }}>
        {typewriterText}
        <span 
          style={{ 
            opacity: typewriterText.length < fullText.length ? 1 : 0,
            animation: 'blink 1s infinite',
            marginLeft: '2px'
          }}
        >|</span>
      </p>
    </div>
    
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '1.5rem'
    }}>
      {/* Los botones permanecen igual */}
      <button 
        onClick={() => selectInputMethod('text')}
         style={{
          background: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 5px 20px rgba(212, 175, 55, 0.2)',
          borderColor: 'rgba(212, 175, 55, 0.4)',
          color: 'white',
          padding: '0.8rem 1.5rem',
          borderRadius: '2rem',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
    e.currentTarget.style.boxShadow = '0 5px 20px rgba(212, 175, 55, 0.2)';
    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';        }}
        onMouseOut={(e) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
        }}
      >
        Type Message
      </button>
      
      <button 
        onClick={() => selectInputMethod('voice')}
        style={{
          background: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 5px 20px rgba(212, 175, 55, 0.2)',
          borderColor: 'rgba(212, 175, 55, 0.4)',
          color: 'white',
          padding: '0.8rem 1.5rem',
          borderRadius: '2rem',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
    e.currentTarget.style.boxShadow = '0 5px 20px rgba(212, 175, 55, 0.2)';
    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';        }}
        onMouseOut={(e) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
        }}
      >
        Speak to Us
      </button>
    </div>
  </div>
)}


      
      {interactionState === 'inputting' && inputMethod === 'text' && (
        <form 
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          <textarea
            ref={textInputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything..."
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              fontSize: '1rem',
              minHeight: '100px',
              resize: 'none',
              marginBottom: '1rem',
              outline: 'none'
            }}
          />
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <button
              type="button"
              onClick={resetInterface}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.7)',
                padding: '0.7rem 1.2rem',
                borderRadius: '2rem',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={!inputText.trim()}
              style={{
                background: inputText.trim() ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '0.7rem 1.5rem',
                borderRadius: '2rem',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                fontSize: '0.9rem',
                opacity: inputText.trim() ? 1 : 0.7
              }}
            >
              Submit
            </button>
          </div>
        </form>
      )}
      
      {interactionState === 'inputting' && inputMethod === 'voice' && (
        <div style={{
          textAlign: 'center',
          color: 'white',
          animation: recording ? 'pulse 1.5s infinite ease-in-out' : 'fadeIn 0.5s ease-out'
        }}>
          <div style={{
            fontSize: '1.2rem',
            margin: '1rem 0 2rem',
            opacity: recording ? 1 : 0.8
          }}>
            {recording 
              ? "Listening to your voice..." 
              : inputText 
                ? "I heard you say:" 
                : "Click the microphone to begin speaking"}
          </div>
          
          {inputText && !recording && (
            <div style={{
              margin: '1rem 0 2rem',
              padding: '1rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              maxWidth: '500px'
            }}>
              "{inputText}"
            </div>
          )}
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            marginTop: '1rem'
          }}>
            {!recording && (
              <button
                onClick={resetInterface}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Cancel
              </button>
            )}
            
            {!recording && inputText && (
              <button
                onClick={handleSubmit}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Submit
              </button>
            )}
            
            {!recording && !inputText && (
              <button
                onClick={startVoiceRecording}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                }}
              >
                🎤
              </button>
            )}
            
            {recording && (
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,0,0,0.15)',
                border: '1px solid rgba(255,0,0,0.5)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                animation: 'pulse 1s infinite ease-in-out'
              }}>
                🎤
              </div>
            )}
          </div>
        </div>
      )}
      
      {interactionState === 'processing' && (
        <div style={{
          color: 'white',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <div style={{
            fontSize: '1rem',
            opacity: 0.8,
            marginBottom: '1rem',
            letterSpacing: '1px'
          }}>
            PROCESSING RESPONSE...
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            margin: '2rem 0'
          }}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'white',
                  opacity: 0.6,
                  animation: `pulse 1s infinite ease-in-out ${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {interactionState === 'response' && (
        <div style={{
          maxWidth: '600px',
          color: 'white',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <div style={{
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            opacity: 0.7,
            letterSpacing: '2px',
            marginBottom: '1rem'
          }}>
             Response:
          </div>
          
          <p style={{
            fontSize: '1.2rem',
            lineHeight: 1.6,
            margin: '0 0 2rem',
            padding: '1rem 2rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '1rem',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {responseText}
          </p>
          
          <button
            onClick={resetInterface}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '0.8rem 2rem',
              borderRadius: '2rem',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            Cancel
          </button>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default BlackHoleInterface;

