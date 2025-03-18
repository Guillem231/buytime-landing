import { useEffect } from 'react';
import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { vertexShader } from '../shaders/vertexShader';
import { fragmentShader } from '../shaders/fragmentShader';

const useKinectScene = (containerRef, cameraRef, showGUI) => {
  useEffect(() => {
    // Check if mobile device
    const isMobile = window.innerWidth < 768;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    window.scene = scene;
    
    // Use more moderate FOV values for mobile to ensure visibility
    const fov = isMobile ? 70 : 50;
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 10000);
    
    // Use a more moderate camera distance for mobile
    camera.position.set(0, 0, isMobile ? 1000 : 500);
    cameraRef.current = camera;
    
    const container = containerRef.current;
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    
    const pixelRatio = isMobile ? Math.min(1.5, window.devicePixelRatio) : window.devicePixelRatio;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    window.renderer = renderer;
    
    const video = document.createElement('video');
    video.loop = true;
    video.muted = true;
    video.crossOrigin = "anonymous";
    video.playsInline = true;
    video.style.display = "none";
    document.body.appendChild(video);
    
    const sourceWebm = document.createElement('source');
    sourceWebm.src = process.env.PUBLIC_URL + '/textures/kinect.webm';
    video.appendChild(sourceWebm);
    
    const sourceMp4 = document.createElement('source');
    sourceMp4.src = process.env.PUBLIC_URL + '/textures/kinect.mp4';
    video.appendChild(sourceMp4);
    
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    
    // Adjust resolution based on device
    const width = isMobile ? 320 : 640;
    const height = isMobile ? 340 : 480;
    const nearClipping = 850;
    const farClipping = isMobile ? 5000 :4000;
    
    const geometry = new THREE.BufferGeometry();
    
    // Use a more moderate sampling rate for mobile
    const samplingRate = isMobile ? 2 : 1; // Sample every 2nd point on mobile
    const numPoints = Math.floor((width * height) / (samplingRate * samplingRate));
    const vertices = new Float32Array(numPoints * 3);
    
    let vertexIndex = 0;
    for (let y = 0; y < height; y += samplingRate) {
      for (let x = 0; x < width; x += samplingRate) {
        const i = vertexIndex * 3;
        vertices[i] = x;
        vertices[i + 1] = y;
        vertices[i + 2] = 0;
        vertexIndex++;
      }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    // Use a more visible point size for mobile
    const pointSize = isMobile ? 4 : 2.5;
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        'map': { value: texture },
        'width': { value: width },
        'height': { value: height },
        'nearClipping': { value: nearClipping },
        'farClipping': { value: farClipping },
        'pointSize': { value: pointSize },
        'zOffset': { value: isMobile ? 700 : 1000 }
      },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });
    
    const mesh = new THREE.Points(geometry, material);
    // Use a more moderate scale for mobile
    if (isMobile) {
      mesh.scale.set(0.85, 0.85, 0.85);
    }
    scene.add(mesh);
    
    if (showGUI && !isMobile) {
      const gui = new GUI();
      gui.add(material.uniforms.nearClipping, 'value', 1, 10000, 1.0).name('nearClipping');
      gui.add(material.uniforms.farClipping, 'value', 1, 10000, 1.0).name('farClipping');
      gui.add(material.uniforms.pointSize, 'value', 1, 10, 1.0).name('pointSize');
      gui.add(material.uniforms.zOffset, 'value', 0, 4000, 1.0).name('zOffset');
    }
    
    // Touch controls for mobile
    let isDragging = false;
    let previousTouchX = 0;
    let previousTouchY = 0;
    
    // Store original camera position to allow reset
    const originalCameraPosition = camera.position.clone();
    
    // Touch start handler
    const onTouchStart = (event) => {
      if (event.touches.length === 1) {
        isDragging = true;
        previousTouchX = event.touches[0].clientX;
        previousTouchY = event.touches[0].clientY;
        event.preventDefault(); // Prevent default to avoid scrolling
      }
    };
    
    // Touch move handler
    const onTouchMove = (event) => {
      if (!isDragging || event.touches.length !== 1) return;
      
      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;
      
      // Calculate movement delta
      const deltaX = touchX - previousTouchX;
      const deltaY = touchY - previousTouchY;
      
      // Move camera based on touch movement
      // Invert X movement for natural feel (drag right = scene moves left)
      camera.position.x -= deltaX * 1.0;
      // Y movement is not inverted (drag down = scene moves down)
      camera.position.y += deltaY * 1.0;
      
      // Limit camera movement to prevent going too far
      const maxOffset = 400;
      camera.position.x = Math.max(Math.min(camera.position.x, maxOffset), -maxOffset);
      camera.position.y = Math.max(Math.min(camera.position.y, maxOffset), -maxOffset);
      
      previousTouchX = touchX;
      previousTouchY = touchY;
      
      event.preventDefault(); // Prevent default to avoid scrolling
    };
    
    // Touch end handler
    const onTouchEnd = () => {
      isDragging = false;
    };
    
    // Double tap to reset camera position
    let lastTapTime = 0;
    const onDoubleTap = (event) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapTime;
      
      if (tapLength < 300 && tapLength > 0) {
        // Double tap detected - reset camera position
        camera.position.x = originalCameraPosition.x;
        camera.position.y = originalCameraPosition.y;
        camera.position.z = originalCameraPosition.z;
        event.preventDefault();
      }
      
      lastTapTime = currentTime;
    };
    
    // Add touch event listeners for mobile
    if (isMobile) {
      container.addEventListener('touchstart', onTouchStart, { passive: false });
      container.addEventListener('touchmove', onTouchMove, { passive: false });
      container.addEventListener('touchend', onTouchEnd);
      container.addEventListener('touchstart', onDoubleTap);
    }
    
    // Ensure the scene is rendered initially
    renderer.render(scene, camera);
    
    const onWindowResize = () => {
      // Check if device orientation changed (mobile)
      const newIsMobile = window.innerWidth < 768;
      
      // Update point size if device type changed
      if (newIsMobile !== isMobile) {
        material.uniforms.pointSize.value = newIsMobile ? 3.0 : 2.5;
        material.uniforms.zOffset.value = newIsMobile ? 1000 : 1000;
        camera.position.z = newIsMobile ? 1000 : 500;
        camera.fov = newIsMobile ? 70 : 50;
        
        // Update mesh scale
        if (newIsMobile) {
          mesh.scale.set(0.85, 0.85, 0.85);
        } else {
          mesh.scale.set(1, 1, 1);
        }
        
        // Add or remove touch controls based on device type
        if (newIsMobile) {
          container.addEventListener('touchstart', onTouchStart, { passive: false });
          container.addEventListener('touchmove', onTouchMove, { passive: false });
          container.addEventListener('touchend', onTouchEnd);
          container.addEventListener('touchstart', onDoubleTap);
        } else {
          container.removeEventListener('touchstart', onTouchStart);
          container.removeEventListener('touchmove', onTouchMove);
          container.removeEventListener('touchend', onTouchEnd);
          container.removeEventListener('touchstart', onDoubleTap);
        }
      }
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Force a render after resize
      renderer.render(scene, camera);
    };
    
    window.addEventListener('resize', onWindowResize);
    
    // Handle device orientation change specifically for mobile
    window.addEventListener('orientationchange', () => {
      // Small delay to ensure dimensions are updated
      setTimeout(onWindowResize, 100);
    });
    
    const tryPlayVideo = () => {
      video.play().catch(error => {
        console.log("Autoplay prevented, need user interaction:", error);
        document.addEventListener('click', () => {
          video.play();
        }, { once: true });
        
        // For mobile, also try on touch
        document.addEventListener('touchstart', () => {
          video.play();
        }, { once: true });
      });
    };
    
    video.load();
    video.addEventListener('loadeddata', tryPlayVideo);
    
    // Add a specific animation loop for mobile to ensure continuous rendering
    if (isMobile) {
      const animateMobile = () => {
        requestAnimationFrame(animateMobile);
        renderer.render(scene, camera);
      };
      animateMobile();
    }
    
    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('orientationchange', onWindowResize);
      
      // Clean up touch event listeners
      if (isMobile) {
        container.removeEventListener('touchstart', onTouchStart);
        container.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('touchend', onTouchEnd);
        container.removeEventListener('touchstart', onDoubleTap);
      }
      
      if (video) {
        video.pause();
        video.remove();
      }
      
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) {
        if (container) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      
      delete window.renderer;
      delete window.scene;
    };
  }, [containerRef, cameraRef, showGUI]);
  
  return null;
};

export default useKinectScene;
