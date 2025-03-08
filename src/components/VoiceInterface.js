import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './VoiceInterface.css';

gsap.registerPlugin(ScrollTrigger);

const VoiceInterface = () => {
  const containerRef = useRef(null);
  const sphereRef = useRef(null);
  const waveformRef = useRef(null);
  const transcriptRef = useRef(null);
  const lavaEffectRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [stage, setStage] = useState('initial'); // initial, listening, processing, responded
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [morphTimeout, setMorphTimeout] = useState(null);

  const recognitionRef = useRef(null);

  // Create antimatter lava effect
  const createAntimatterEffect = () => {
    if (!lavaEffectRef.current) return;

    const container = lavaEffectRef.current;
    container.innerHTML = '';

    // Create blobs for lava effect
    for (let i = 0; i < 5; i++) {
      const blob = document.createElement('div');
      blob.className = 'antimatter-blob';

      const size = 100 + Math.random() * 150;
      blob.style.width = `${size}px`;
      blob.style.height = `${size}px`;

      const posX = -40 + Math.random() * 80;
      const posY = -40 + Math.random() * 80;
      blob.style.left = `calc(50% + ${posX}px)`;
      blob.style.top = `calc(50% + ${posY}px)`;

      const hue = 45 + (Math.random() * 10 - 5); // Gold is around 45
      blob.style.backgroundColor = `hsla(${hue}, 80%, 50%, 0.2)`;
      blob.style.filter = 'blur(30px)';

      container.appendChild(blob);

      gsap.to(blob, {
        x: -30 + Math.random() * 60,
        y: -30 + Math.random() * 60,
        scale: 0.8 + Math.random() * 0.4,
        duration: 8 + Math.random() * 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 3,
      });
    }

    // Create edge distortion effect
    const edgeEffect = document.createElement('div');
    edgeEffect.className = 'edge-distortion';
    container.appendChild(edgeEffect);

    gsap.to(edgeEffect, {
      rotation: 360,
      duration: 120,
      repeat: -1,
      ease: 'none',
    });
  };

  // Safe way to start speech recognition
  const startRecognition = () => {
    if (recognitionRef.current && !recognitionActive) {
      try {
        recognitionRef.current.start();
        console.log('Speech recognition started');
      } catch (error) {
        console.log('Error starting recognition:', error);
        setRecognitionActive(false);
      }
    }
  };

  // Safe way to stop speech recognition
  const stopRecognition = () => {
    if (recognitionRef.current && recognitionActive) {
      try {
        recognitionRef.current.stop();
        console.log('Speech recognition stopped');
      } catch (error) {
        console.log('Error stopping recognition:', error);
      }
    }
  };

  // Display transcript with animation
  const displayTranscript = (text) => {
    setTranscript(text);

    if (transcriptRef.current) {
      gsap.fromTo(
        transcriptRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  };

  // Process response after speech recognition
  const processResponse = () => {
    setListening(false);
    stopWaveformAnimation();
    stopRecognition();

    const aura = sphereRef.current.querySelector('.listening-aura');
    if (aura) {
      gsap.to(aura, {
        opacity: 0,
        scale: 1.5,
        duration: 0.5,
        onComplete: () => aura.remove(),
      });
    }

    gsap.to(sphereRef.current, {
      boxShadow: '0 0 30px rgba(212, 175, 55, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3)',
      scale: 0.95,
      duration: 0.5,
    });

    const blobs = document.querySelectorAll('.antimatter-blob');
    blobs.forEach((blob) => {
      const originalScale = blob._gsap ? blob._gsap.vars.scale : 1;
      gsap.to(blob, {
        filter: 'blur(40px)',
        scale: originalScale * 1.2,
        duration: 1.2,
        repeat: 2,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    for (let i = 0; i < 3; i++) {
      const pulse = document.createElement('div');
      pulse.className = 'energy-pulse';
      sphereRef.current.appendChild(pulse);

      gsap.fromTo(
        pulse,
        { opacity: 0.8, scale: 0.2 },
        {
          opacity: 0,
          scale: 1.7,
          duration: 1.5,
          delay: i * 0.7,
          ease: 'expo.out',
          onComplete: () => pulse.remove(),
        }
      );
    }

    setTimeout(() => {
      showResponse();
    }, 2500);
  };

  // Morph sphere shape and color
  const morphSphere = () => {
    const sphere = sphereRef.current;
    if (!sphere) return;

    const topLeft = 40 + Math.random() * 20;
    const topRight = 40 + Math.random() * 20;
    const bottomLeft = 40 + Math.random() * 20;
    const bottomRight = 40 + Math.random() * 20;

    const vRatio1 = 40 + Math.random() * 20;
    const vRatio2 = 40 + Math.random() * 20;
    const hRatio1 = 40 + Math.random() * 20;
    const hRatio2 = 40 + Math.random() * 20;

    const hue = 35 + Math.random() * 20;
    const sat = 70 + Math.random() * 20;
    const light = 40 + Math.random() * 10;

    gsap.to(sphere, {
      borderRadius: `${topLeft}% ${topRight}% ${bottomRight}% ${bottomLeft}% / ${vRatio1}% ${vRatio2}% ${hRatio2}% ${hRatio1}%`,
      boxShadow: `0 5px 35px rgba(${220 + Math.random() * 35}, ${175 + Math.random() * 30}, ${55 + Math.random() * 20}, 0.7), 
                  inset 0 0 40px rgba(${220 + Math.random() * 35}, ${175 + Math.random() * 30}, ${55 + Math.random() * 20}, 0.3)`,
      background: `radial-gradient(circle at ${30 + Math.random() * 40}% ${30 + Math.random() * 40}%, 
                  hsla(${hue}, ${sat}%, ${light + 10}%, 0.8) 0%, 
                  hsla(${hue - 5}, ${sat - 10}%, ${light - 10}%, 0.9) 70%, 
                  hsla(${hue - 10}, ${sat - 20}%, ${light - 20}%, 1) 100%)`,
      duration: 3 + Math.random() * 2,
      ease: 'sine.inOut',
      onComplete: () => {
        const nextMorph = setTimeout(morphSphere, 1000 + Math.random() * 2000);
        setMorphTimeout(nextMorph);
      },
    });
  };

  // Display prompt text
  const displayPrompt = () => {
    gsap.to('.prompt-text', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'back.out',
      onComplete: () => {
        sphereRef.current.addEventListener('click', handleSphereClick);
      },
    });
  };

  // Handle sphere click
  const handleSphereClick = () => {
    if (stage === 'initial') {
      startRecognition();
      startListening();
    }
  };

  // Start listening state
  const startListening = () => {
    if (stage !== 'initial') return;

    setStage('listening');
    setListening(true);
    setTranscript('');
    setResponse('');

    gsap.to(sphereRef.current, {
      boxShadow: '0 0 50px rgba(212, 175, 55, 0.7), inset 0 0 30px rgba(212, 175, 55, 0.4)',
      scale: 1.1,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)',
    });

    const aura = document.createElement('div');
    aura.className = 'listening-aura';
    sphereRef.current.appendChild(aura);

    gsap.fromTo(
      aura,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 0.7,
        scale: 1.2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }
    );

    animateWaveform();
  };

  // Animate waveform bars
  const animateWaveform = () => {
    const waveform = waveformRef.current;
    if (!waveform) return;

    const bars = waveform.querySelectorAll('.bar');
    bars.forEach((bar) => {
      gsap.to(bar, {
        height: () => `${20 + Math.random() * 30}px`,
        duration: 0.2 + Math.random() * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  };

  // Stop waveform animation
  const stopWaveformAnimation = () => {
    const waveform = waveformRef.current;
    if (!waveform) return;

    const bars = waveform.querySelectorAll('.bar');
    bars.forEach((bar) => {
      gsap.killTweensOf(bar);
      gsap.to(bar, {
        height: '5px',
        duration: 0.3,
        ease: 'power1.out',
      });
    });
  };

  // Show response after processing
  const showResponse = () => {
    setStage('responded');

    const responses = [
      "Don't waste my time with this nonsense.",
      "I've got better things to do. Go away.",
      "Seriously? That's what you're asking me?",
      "Yeah... not interested. Try Google.",
      "Look, I'm really busy right now.",
      "How about no? Does no work for you?",
    ];

    setResponse(responses[Math.floor(Math.random() * responses.length)]);

    gsap.fromTo(
      '.response-text',
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }
    );

    gsap.to(sphereRef.current, {
      boxShadow: '0 0 70px rgba(212, 175, 55, 0.9), inset 0 0 40px rgba(255, 255, 255, 0.6)',
      background: 'radial-gradient(circle, rgba(30, 30, 30, 0.9) 0%, rgba(0, 0, 0, 1) 90%)',
      duration: 0.3,
      onComplete: () => {
        gsap.to(sphereRef.current, {
          boxShadow: '0 0 25px rgba(212, 175, 55, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.6)',
          background: 'radial-gradient(circle, rgba(20, 20, 20, 0.8) 0%, rgba(0, 0, 0, 1) 90%)',
          duration: 0.7,
          delay: 0.2,
          ease: 'power2.out',
        });
      },
    });

    const blobs = document.querySelectorAll('.antimatter-blob');
    blobs.forEach((blob) => {
      const originalPosition = {
        x: blob._gsap ? blob._gsap.x : 0,
        y: blob._gsap ? blob._gsap.y : 0,
      };

      gsap.to(blob, {
        x: originalPosition.x + (-80 + Math.random() * 160),
        y: originalPosition.y + (-80 + Math.random() * 160),
        scale: 0.3 + Math.random() * 0.3,
        opacity: 0.7,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(blob, {
            x: originalPosition.x,
            y: originalPosition.y,
            scale: 0.8 + Math.random() * 0.4,
            opacity: 1,
            duration: 3,
            ease: 'elastic.out(1, 0.3)',
          });
        },
      });
    });

    setTimeout(() => {
      gsap.to('.response-text', {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
          setStage('initial');
          setTranscript('');
          gsap.to('.prompt-text', { opacity: 1, y: 0, duration: 0.3 });

          setTimeout(() => {
            startRecognition();
          }, 500);
        },
      });
    }, 4000);
  };

  // Initialize component
  useEffect(() => {
    const sphere = sphereRef.current;
    const container = containerRef.current;

    gsap.set(sphere, { scale: 0.9, opacity: 0 });
    gsap.set(container, { opacity: 0 });

    gsap.to(container, {
      opacity: 1,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.5,
    });

    gsap.to(sphere, {
      scale: 1,
      opacity: 1,
      duration: 1.8,
      ease: 'elastic.out(1, 0.7)',
      delay: 0.8,
      onComplete: () => {
        createAntimatterEffect();
        displayPrompt();
      },
    });

    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setRecognitionActive(true);
      };

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;

        if (transcriptText.trim() !== '') {
          if (stage === 'initial') {
            startListening();
          }
          displayTranscript(transcriptText);
        }
      };

      recognitionRef.current.onend = () => {
        setRecognitionActive(false);

        if (stage === 'listening' && transcript.trim() !== '') {
          setStage('processing');
          processResponse();
        } else if (stage === 'initial') {
          setTimeout(() => {
            startRecognition();
          }, 300);
        }
      };
    }

    const initialMorph = setTimeout(morphSphere, 3000);
    setMorphTimeout(initialMorph);

    return () => {
      stopRecognition();
      if (sphereRef.current) {
        sphereRef.current.removeEventListener('click', handleSphereClick);
      }
      if (morphTimeout) clearTimeout(morphTimeout);
    };
  }, [stage]);

  return (
    <div ref={containerRef} className="voice-interface-container">
      <div ref={sphereRef} className="voice-circle">
        <div ref={lavaEffectRef} className="antimatter-container"></div>

        {stage === 'initial' && <div className="prompt-text">What do you need?</div>}

        {stage === 'listening' && (
          <div ref={waveformRef} className="waveform">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="bar"></div>
            ))}
          </div>
        )}

        {stage === 'processing' && <div className="processing-text">Processing...</div>}

        {transcript && (
          <div ref={transcriptRef} className="transcript-container">
            "{transcript}"
          </div>
        )}

        {response && <div className="response-text">{response}</div>}
      </div>
    </div>
  );
};

export default VoiceInterface;