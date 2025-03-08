import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

const KinectBackground = ({ showGUI = false }) => {
  const containerRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector3(0, 0, 1));
  const animationFrameRef = useRef(null);
  const cameraRef = useRef(null);
  const centerRef = useRef(new THREE.Vector3(0, 0, -1000));
  
  // Mouse movement handler outside the main useEffect
  const handleMouseMove = (event) => {
    mouseRef.current.x = (event.clientX - window.innerWidth / 2) * 8;
    mouseRef.current.y = (event.clientY - window.innerHeight / 2) * 8;
  };
  
  // Separate useEffect specifically for mouse move event listener
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Animation function outside the main useEffect
  const animate = () => {
    animationFrameRef.current = requestAnimationFrame(animate);
    
    if (cameraRef.current) {
      // Update camera position based on mouse position
      cameraRef.current.position.x += (mouseRef.current.x - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y += (-mouseRef.current.y - cameraRef.current.position.y) * 0.05;
      cameraRef.current.lookAt(centerRef.current);
    }
    
    if (window.renderer && window.scene && cameraRef.current) {
      window.renderer.render(window.scene, cameraRef.current);
    }
  };
  
  // Main setup useEffect
  useEffect(() => {
    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000) // Black background
    window.scene = scene;
    
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 500);
    cameraRef.current = camera;
    
    const container = containerRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    window.renderer = renderer;
    
    // Create video element
    const video = document.createElement('video');
    video.loop = true;
    video.muted = true;
    video.crossOrigin = "anonymous";
    video.playsInline = true;
    video.style.display = "none";
    document.body.appendChild(video);
    
    // Add video sources
    const sourceWebm = document.createElement('source');
    sourceWebm.src = process.env.PUBLIC_URL + '/textures/kinect.webm';
    video.appendChild(sourceWebm);
    
    const sourceMp4 = document.createElement('source');
    sourceMp4.src = process.env.PUBLIC_URL + '/textures/kinect.mp4';
    video.appendChild(sourceMp4);
    
    // Create video texture
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    
    // Define dimensions
    const width = 640, height = 480;
    const nearClipping = 850, farClipping = 4000;
    
    // Create geometry for points
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(width * height * 3);
    
    for (let i = 0, j = 0, l = vertices.length; i < l; i += 3, j++) {
      vertices[i] = j % width;
      vertices[i + 1] = Math.floor(j / width);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    // Define shaders
    const vertexShader = `
      uniform sampler2D map;
      uniform float width;
      uniform float height;
      uniform float nearClipping, farClipping;
      uniform float pointSize;
      uniform float zOffset;
      varying vec2 vUv;
      varying float vDepth;
      const float XtoZ = 1.11146; // tan(1.0144686 / 2.0) * 2.0;
      const float YtoZ = 0.83359; // tan(0.7898090 / 2.0) * 2.0;
      
      void main() {
        vUv = vec2(position.x / width, position.y / height);
        vec4 color = texture2D(map, vUv);
        float depth = (color.r + color.g + color.b) / 3.0;
        vDepth = depth; // Pass depth to fragment shader for color mapping
        float z = (1.0 - depth) * (farClipping - nearClipping) + nearClipping;
        vec4 pos = vec4(
          (position.x / width - 0.5) * z * XtoZ,
          (position.y / height - 0.5) * z * YtoZ,
          -z + zOffset,
          1.0
        );
        gl_PointSize = pointSize;
        gl_Position = projectionMatrix * modelViewMatrix * pos;
      }
    `;
    
      const fragmentShader = `
  uniform sampler2D map;
  varying vec2 vUv;
  varying float vDepth;
  
  void main() {
    vec4 color = texture2D(map, vUv);
    
    // Create custom color scheme with black, gold, white, and gray
    vec3 colorScheme;
    float alpha = 0.3; // CAMBIADO: Reducido de 0.5 a 0.3 para todos los puntos
    
    if (vDepth < 0.3) {
      // Darker areas - black with slight gold hint
      colorScheme = vec3(0.1, 0.08, 0.02);
      alpha = 0.2; // CAMBIADO: Reducido de 0.3 a 0.2
    } else if (vDepth < 0.5) {
      // Mid-dark areas - dark gold
      colorScheme = vec3(0.5, 0.4, 0.1);
      alpha = 0.15; // CAMBIADO: Reducido de 0.25 a 0.15
    } else if (vDepth < 0.7) {
      // Mid-light areas - bright gold
      colorScheme = vec3(0.83, 0.69, 0.22); // D4AF37 gold
      alpha = 0.2; // CAMBIADO: Reducido de 0.3 a 0.2
    } else if (vDepth < 0.9) {
      // Light areas - light gray
      colorScheme = vec3(0.8, 0.8, 0.8);
      alpha = 0.15; // CAMBIADO: Reducido de 0.25 a 0.15
    } else {
      // Brightest areas - white
      colorScheme = vec3(1.0, 1.0, 1.0);
      alpha = 0.2; // CAMBIADO: Reducido de 0.3 a 0.2
    }
    
    // Add a radial gradient vignette effect
    vec2 center = vec2(0.5, 0.45); // Center of gradient (slightly above the middle)
    float distance = length(gl_FragCoord.xy / vec2(1920.0, 1080.0) - center);
    float vignette = smoothstep(0.2, 1.0, distance);
    
    // Darken the color based on distance from center
    colorScheme = mix(colorScheme, vec3(0.0, 0.0, 0.0), vignette * 0.8); // CAMBIADO: Aumentado de 0.6 a 0.8
    
    gl_FragColor = vec4(colorScheme, alpha);
  }
`;

    
    // Create material with shaders
    const material = new THREE.ShaderMaterial({
      uniforms: {
        'map': { value: texture },
        'width': { value: width },
        'height': { value: height },
        'nearClipping': { value: nearClipping },
        'farClipping': { value: farClipping },
        'pointSize': { value: 2.5 }, // Slightly larger points
        'zOffset': { value: 1000 }
      },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });
    
    // Create point cloud
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
    
    // Add GUI if needed
    if (showGUI) {
      const gui = new GUI();
      gui.add(material.uniforms.nearClipping, 'value', 1, 10000, 1.0).name('nearClipping');
      gui.add(material.uniforms.farClipping, 'value', 1, 10000, 1.0).name('farClipping');
      gui.add(material.uniforms.pointSize, 'value', 1, 10, 1.0).name('pointSize');
      gui.add(material.uniforms.zOffset, 'value', 0, 4000, 1.0).name('zOffset');
    }
    
    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', onWindowResize);
    
    // Play video with handling for autoplay restrictions
    const tryPlayVideo = () => {
      video.play().catch(error => {
        console.log("Autoplay prevented, need user interaction:", error);
        document.addEventListener('click', () => {
          video.play();
        }, { once: true });
      });
    };
    
    // Load and play video
    video.load();
    video.addEventListener('loadeddata', tryPlayVideo);
    
    // Start animation
    animate();
    
    // Cleanup function with cancelAnimationFrame
    return () => {
      // Proper cleanup with cancelAnimationFrame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('resize', onWindowResize);
      
      // Stop and remove video
      if (video) {
        video.pause();
        video.remove();
      }
      
      // Dispose Three.js resources
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) {
        if (container) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      
      // Clean up globals
      delete window.renderer;
      delete window.scene;
    };
  }, [showGUI]);
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1
      }} 
    />
  );
};

export default KinectBackground;
