import React from 'react';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading words...</p>
    </div>
  );
}

export default LoadingSpinner;