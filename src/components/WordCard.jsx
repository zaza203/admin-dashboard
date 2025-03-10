import React from 'react';
import AudioRecorder from './AudioRecorder';

function WordRecorder({ word, recordings = [], onRecordingAdded, onRecordingDeleted, registerActiveRecorder }) {
  return (
    <div className="card mb-4">
      <div className="card-header" style={{ background: "#E9ECEF" }}>
        <h2 className="text-center">{word.Word}</h2>
      </div>
      <div className="card-body">
        <p className="lead text-center mb-4 fw-semibold" style={{ fontSize: '12px'}}>
          Please record the Esimbi pronunciation for this word
        </p>
        
        <AudioRecorder 
            onRecordingComplete={onRecordingAdded}
            registerActiveRecorder={registerActiveRecorder} 
        />
        
        {recordings.length > 0 && (
          <div className="mt-4">
            <div className="list-group">
              {recordings.map((recording, index) => (
                <div key={index} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <div className="me-2 mb-2 mb-md-0">
                    <span className="badge bg-secondary me-2">#{index + 1}</span>
                  </div>
                  <audio src={URL.createObjectURL(recording)} controls className="me-2 flex-grow-1" />
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => onRecordingDeleted(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WordRecorder;