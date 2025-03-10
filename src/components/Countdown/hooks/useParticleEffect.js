import { useEffect } from 'react';
import * as THREE from 'three';

const useParticleEffect = (canvasRef) => {
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
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    const createWaveParticles = () => {
      const particleCount = 1500;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      const colorPalette = [
        new THREE.Color('#FFD700'),
        new THREE.Color('#F5F5F5'),
        new THREE.Color('#D4AF37'),
        new THREE.Color('#FFC107'),
        new THREE.Color('#FFFFFF'),
        new THREE.Color('#E6C200')
      ];
      
      for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * canvas.clientWidth * 0.05;
        const y = (Math.random() * 0.5 - 0.8) * 5;
        const z = (Math.random() - 0.5) * 3;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        const colorIndex = Math.random() > 0.7 
          ? Math.floor(Math.random() * 2) + 4
          : Math.floor(Math.random() * 4);
        
        const color = colorPalette[colorIndex];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = Math.random() * 3 + (Math.random() > 0.9 ? 3 : 1);
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
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
            
            vec3 pos = position;
            
            float waveX = sin(pos.x * 0.5 + time * 0.7) * 0.5;
            float waveY = cos(pos.z * 0.5 + time * 0.7) * 0.5;
            
            pos.y += waveY;
            pos.x += waveX;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (10.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            vec2 uv = gl_PointCoord.xy - 0.5;
            float dist = length(uv);
            if (dist > 0.5) discard;
            
            float glow = 1.0 - smoothstep(0.0, 0.5, dist);
            vec3 finalColor = vColor * glow;
            
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
    
    let animationId = null;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const time = performance.now() * 0.001;
      
      if (particles && particles.material.uniforms) {
        particles.material.uniforms.time.value = time;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
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
};

export default useParticleEffect;
