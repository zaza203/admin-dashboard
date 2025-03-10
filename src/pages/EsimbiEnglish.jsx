import React, { useState, useEffect, useRef } from 'react';
import supabase from "../services/supabaseClient";
import { fetchRandomWords, fetchWords } from '../services/crudSupabase';
import WordRecorder from '../components/WordCard';
import ThankYouScreen from '../components/ThankYouScreen';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/main.css';

function EsimbiEnglish() {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [recordings, setRecordings] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [error, setError] = useState(null);

  const activeRecorderStopFnRef = useRef(null);

  const registerActiveRecorder = (stopFn) => {
    activeRecorderStopFnRef.current = stopFn;
  };
  
  useEffect(() => {
    const clearSession = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) console.log("Error clearing session:", error);
    };
    clearSession();
    checkAndSignInAnonymously();
    loadWords();
}, []);

const stopActiveRecording = () => {
    if (activeRecorderStopFnRef.current) {
      activeRecorderStopFnRef.current();
      activeRecorderStopFnRef.current = null;
    }
  };

  async function checkAndSignInAnonymously() {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        try {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (data) {
            console.log("Successfully login: ", data)
          }
          if (error) {
            console.log("Anonymous sign in error:", error);
          }
        } catch (err) {
          console.log("Error in anonymous sign in:", err);
        }
      }
    } catch (error) {
      console.log("Session check error:", error);
    }
  }
  
  const loadWords = async () => {
    setLoading(true);
    try {
      const randomWords = await fetchWords(200);
      setWords(randomWords);
      setCurrentWordIndex(0);
      setRecordings({});
    } catch (err) {
      setError("Failed to load words. Oops we encountered an error, please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleRecordingAdded = (word, audioBlob) => {
    setRecordings(prevRecordings => {
      const wordRecordings = prevRecordings[word.id] || { word: word.Word, recordings: [] };
      return {
        ...prevRecordings,
        [word.id]: {
          word: word.Word,
          recordings: [...wordRecordings.recordings, audioBlob]
        }
      };
    });
  };

  const handleRecordingDeleted = (word, index) => {
    setRecordings(prevRecordings => {
      const wordRecordings = [...(prevRecordings[word.id]?.recordings || [])];
      wordRecordings.splice(index, 1);
      return {
        ...prevRecordings,
        [word.id]: { word: word, recordings: wordRecordings }
      };
    });
  };
  
  const handleNextWord = () => {
    stopActiveRecording();
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const handlePrevWord = () => {
    stopActiveRecording();
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleSubmitAll = async () => {
    stopActiveRecording();
    const hasRecordings = Object.keys(recordings).length > 0;
    if (!hasRecordings) {
      setError("Please record at least one pronunciation before submitting.");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const { uploadAllRecordings } = await import('../services/crudSupabase');
      
      await uploadAllRecordings(recordings);
      
      setShowThankYou(true);
    } catch (err) {
      console.error('Error submitting recordings:', err);
      setError("Failed to submit recordings. This maybe caused by internet connection, please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleContinueContributing = () => {
    setShowThankYou(false);
    loadWords();
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (showThankYou) {
    return <ThankYouScreen onContinue={handleContinueContributing} />;
  }
  
  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">Esimbi Pronunciation Recorder</h1>
          
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
            </div>
          )}
          
          <div className="progress mb-3">
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
              aria-valuenow={currentWordIndex + 1} 
              aria-valuemin="0" 
              aria-valuemax={words.length}
            >
              {currentWordIndex + 1} / {words.length}
            </div>
          </div>
          
          <div className="mb-3 d-flex">
            <span style={{ fontSize: '12px'}}>Enter the audio recording for each Esimbi word. You can add multiple recordings for a word and skip those you don't know the translation for. Ensure to submit the audio at the end.</span>
          </div>
        </div>
      </div>
      
      {words.length > 0 && (
        <WordRecorder 
          word={words[currentWordIndex]} 
          recordings={recordings[words[currentWordIndex]?.id]?.recordings || []}
          onRecordingAdded={(blob) => handleRecordingAdded(words[currentWordIndex], blob)}
          onRecordingDeleted={(index) => handleRecordingDeleted(words[currentWordIndex], index)}
          registerActiveRecorder={registerActiveRecorder}
        />
      )}
      
      <div className="d-flex justify-content-between mt-4">
        <button 
          className="btn btn-secondary" 
          onClick={handlePrevWord}
          disabled={currentWordIndex === 0 || submitting}
        >
          Previous Word
        </button>
        
        {currentWordIndex < words.length - 1 && (
          <button 
            className="btn btn-primary" 
            onClick={handleNextWord}
            disabled={currentWordIndex === words.length - 1 || submitting}
          >
            Next Word
          </button>
        )}
      </div>
      
      {Object.values(recordings).flat().length > 0 && (
        <div className="d-grid mt-3">
          <button 
            className="btn btn-success" 
            onClick={handleSubmitAll}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
}

export default EsimbiEnglish;