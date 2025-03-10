import React, { useState, useEffect, useRef } from 'react';

function AudioRecorder({ onRecordingComplete, registerActiveRecorder }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRecording && registerActiveRecorder) {
      registerActiveRecorder(stopRecording);
    } else if (!isRecording && registerActiveRecorder) {
      registerActiveRecorder(null);
    }
    
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isRecording, registerActiveRecorder]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        onRecordingComplete(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start the timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };
  
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      clearInterval(timerRef.current);
    }
  };
  
  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            {isRecording && (
              <div className="d-flex align-items-center">
                <div className={`recording-indicator me-2 ${isPaused ? '' : 'active'}`}></div>
                <span>{formatTime(recordingTime)}</span>
              </div>
            )}
          </div>
          <div className="btn-group">
            {!isRecording ? (
              <button 
                className="btn btn-danger" 
                onClick={startRecording}
              >
                <i className="bi bi-mic-fill me-1"></i> Record
              </button>
            ) : (
              <>
                {isPaused ? (
                  <button 
                    className="btn btn-warning" 
                    onClick={resumeRecording}
                  >
                    <i className="bi bi-play-fill me-1"></i> Resume
                  </button>
                ) : (
                  <button 
                    className="btn btn-warning" 
                    onClick={pauseRecording}
                  >
                    <i className="bi bi-pause-fill me-1"></i> Pause
                  </button>
                )}
                <button 
                  className="btn btn-success" 
                  onClick={stopRecording}
                >
                  <i className="bi bi-stop-fill me-1"></i> Stop
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioRecorder;