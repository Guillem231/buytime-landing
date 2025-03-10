import * as THREE from 'three';

export const createBlackHole = (scene, shader) => {
  const blackHoleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(800, 800) },
      intensity: { value: 1.0 }
    },
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const blackHoleGeometry = new THREE.CircleGeometry(1.8, 64);
  const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
  scene.add(blackHole);
  
  return blackHole;
};

export const createParticleSystem = (scene, shader) => {
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
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    transparent: true,
    blending: THREE.NormalBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.userData = { velocities: particleVelocities };
  scene.add(particles);

  return particles;
};
