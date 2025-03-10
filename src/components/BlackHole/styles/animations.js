import { gsap } from 'gsap';

export const fadeIn = (element, duration = 0.5, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 10 },
    { 
      opacity: 1, 
      y: 0, 
      duration, 
      delay, 
      ease: 'power2.out' 
    }
  );
};

export const fadeOut = (element, duration = 0.3) => {
  return gsap.to(element, { 
    opacity: 0, 
    y: -10, 
    duration, 
    ease: 'power2.in' 
  });
};

export const pulseAnimation = (element, intensity = 1.1, duration = 1) => {
  return gsap.timeline({ repeat: -1, yoyo: true })
    .to(element, { 
      scale: intensity, 
      opacity: 1, 
      duration: duration / 2, 
      ease: 'sine.inOut' 
    })
    .to(element, { 
      scale: 1, 
      opacity: 0.7, 
      duration: duration / 2, 
      ease: 'sine.inOut' 
    });
};

export const animateBlackHoleIntensity = (uniformValue, targetValue, duration = 0.8) => {
  return gsap.to(uniformValue, {
    value: targetValue,
    duration,
    ease: 'power2.inOut'
  });
};

export const animateBackgroundFade = (targetOpacity, duration = 1) => {
  return gsap.to(document.body, {
    backgroundColor: `rgba(0, 0, 0, ${targetOpacity})`,
    duration,
    ease: 'power1.inOut'
  });
};
