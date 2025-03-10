import { useCallback } from 'react';

const useVoiceRecognition = ({ setInputText, setRecording, onTranscriptReceived }) => {
  const startVoiceRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser doesn't support voice recognition. Try Chrome or Edge.");
      return;
    }
    
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    setRecording(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setRecording(false);
      
      if (onTranscriptReceived) {
        onTranscriptReceived(transcript);
      }
    };
    
    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      setRecording(false);
      setInputText("I couldn't understand what you said...");
    };
    
    recognition.onend = () => {
      setRecording(false);
    };
    
    recognition.start();
  }, [setInputText, setRecording, onTranscriptReceived]);
  
  return { startVoiceRecording };
};

export default useVoiceRecognition;
