import React from 'react';

function ThankYouScreen({ onContinue }) {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card text-center">
            <div className="card-body py-5">
              <h1 className="card-title mb-4">Thank You!</h1>
              <p className="card-text lead mb-4">
                Your Esimbi pronunciation contributions have been successfully recorded.
                We appreciate your valuable input to help preserve and document this language.
              </p>
              <div className="mt-4">
                <p className="mb-3">Would you like to contribute more pronunciations?</p>
                <div className="d-grid gap-2 col-md-6 mx-auto">
                  <button 
                    onClick={onContinue} 
                    className="btn btn-primary btn-lg"
                  >
                    Yes, Continue Contributing
                  </button>
                  <a 
                    href="/" 
                    className="btn btn-outline-secondary"
                  >
                    No
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThankYouScreen;