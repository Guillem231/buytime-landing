import { useEffect } from 'react';
import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { vertexShader } from '../shaders/vertexShader';
import { fragmentShader } from '../shaders/fragmentShader';

const useKinectScene = (containerRef, cameraRef, showGUI) => {
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
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
    
    const width = 640, height = 480;
    const nearClipping = 850, farClipping = 4000;
    
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(width * height * 3);
    
    for (let i = 0, j = 0, l = vertices.length; i < l; i += 3, j++) {
      vertices[i] = j % width;
      vertices[i + 1] = Math.floor(j / width);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        'map': { value: texture },
        'width': { value: width },
        'height': { value: height },
        'nearClipping': { value: nearClipping },
        'farClipping': { value: farClipping },
        'pointSize': { value: 2.5 },
        'zOffset': { value: 1000 }
      },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });
    
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
    
    if (showGUI) {
      const gui = new GUI();
      gui.add(material.uniforms.nearClipping, 'value', 1, 10000, 1.0).name('nearClipping');
      gui.add(material.uniforms.farClipping, 'value', 1, 10000, 1.0).name('farClipping');
      gui.add(material.uniforms.pointSize, 'value', 1, 10, 1.0).name('pointSize');
      gui.add(material.uniforms.zOffset, 'value', 0, 4000, 1.0).name('zOffset');
    }
    
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', onWindowResize);
    
    const tryPlayVideo = () => {
      video.play().catch(error => {
        console.log("Autoplay prevented, need user interaction:", error);
        document.addEventListener('click', () => {
          video.play();
        }, { once: true });
      });
    };
    
    video.load();
    video.addEventListener('loadeddata', tryPlayVideo);
    
    return () => {
      window.removeEventListener('resize', onWindowResize);
      
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
