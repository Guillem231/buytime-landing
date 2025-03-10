import React, { useRef } from 'react';
import useKinectScene from './hooks/useKinectScene';
import useMouseTracking from './hooks/useMouseTracking';
import useAnimation from './hooks/useAnimation';
import styles from './styles/KinectBackground.module.css';
import * as THREE from 'three';


const KinectBackground = ({ showGUI = false }) => {
  const containerRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector3(0, 0, 1));
  const cameraRef = useRef(null);
  const centerRef = useRef(new THREE.Vector3(0, 0, -1000));
  const animationFrameRef = useRef(null);
  
  useMouseTracking(mouseRef);
  useKinectScene(containerRef, cameraRef, showGUI);
  useAnimation(animationFrameRef, cameraRef, mouseRef, centerRef);
  
  return (
    <div 
      ref={containerRef} 
      className={styles.container}
    />
  );
};

export default KinectBackground;
