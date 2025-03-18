import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { createBlackHole, createParticleSystem } from '../../../utils/threeUtils';
import { BLACK_HOLE_SHADER, PARTICLE_SHADER } from '../constants/shaders';

const useBlackHoleAnimation = (canvasRef, interactionState, scrollProgress) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const blackHoleRef = useRef(null);
  const particlesRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    
    const size = Math.min(window.innerWidth * 0.25, 300);
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    const blackHole = createBlackHole(scene, BLACK_HOLE_SHADER);
    blackHoleRef.current = blackHole;
    
    const particles = createParticleSystem(scene, PARTICLE_SHADER);
    particlesRef.current = particles;
    
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      const time = performance.now() * 0.001;
      
      if (blackHole.material.uniforms) {
        blackHole.material.uniforms.time.value = time;
      }
      
      if (particles && particles.geometry && particles.userData.velocities) {
        animateParticles(particles, time, interactionState);
      }
      
      scene.rotation.y = Math.sin(time * 0.1) * 0.1;
      scene.rotation.x = Math.sin(time * 0.15) * 0.05;
      
      renderer.render(scene, camera);
    };
    
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
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
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      
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
      
      sceneRef.current = null;
      cameraRef.current = null;
      blackHoleRef.current = null;
      particlesRef.current = null;
      rendererRef.current = null;
    };
  }, []);
  
  useEffect(() => {
    updateBlackHoleIntensity(interactionState);
  }, [interactionState]);
  
  const handleBlackHoleClick = () => {
    if (interactionState === 'idle') {
      updateBlackHoleIntensity('prompt');
      document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
      document.body.style.transition = 'background-color 2s ease';
    }
  };
  
  
const updateBlackHoleIntensity = (state) => {
  if (blackHoleRef.current && blackHoleRef.current.material.uniforms) {
    let intensity = 1.0;
    let pulseDuration = 1.5; 
    
    switch (state) {
      case 'prompt':
        intensity = 1.4;
        break;
      case 'processing':
        intensity = 1.6;
        pulseDuration = 0.8; 
        break;
      case 'response':
        intensity = 1.2;
        break;
      default:
        intensity = 1.0;
    }
    
    gsap.to(blackHoleRef.current.material.uniforms.intensity, {
      value: intensity,
      duration: 0.8,
      ease: "sine.inOut" 
    });
    
    gsap.to(blackHoleRef.current.scale, {
      x: 1.05, y: 1.05, z: 1.05,
      duration: pulseDuration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
};

  
  const animateParticles = (particles, time, state) => {
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
      
      if (state === 'processing') {
        particles.material.uniforms.intensity.value = 2.0 + Math.sin(time * 5) * 0.5;
      } else if (state === 'response') {
        particles.material.uniforms.intensity.value = 1.8;
      } else {
        particles.material.uniforms.intensity.value = 1.4 + Math.sin(time * 0.5) * 0.2;
      }
    }
  };
  
  return { handleBlackHoleClick };
};

export default useBlackHoleAnimation;
