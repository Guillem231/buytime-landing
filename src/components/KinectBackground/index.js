  import React from 'react';
  import { useDeviceDetector } from '../MobileBlocker/hooks/useDeviceDetector';
  import MobileKinectBackground from './components/MobileKinectBackground';
  import DesktopKinectBackground from './components/DesktopKinectBackground';

  const KinectBackground = ({ showGUI = false }) => {
    const { isMobile } = useDeviceDetector();
  
    return isMobile ? 
      null : 
      <DesktopKinectBackground showGUI={false} />;
  };

  export default KinectBackground;
