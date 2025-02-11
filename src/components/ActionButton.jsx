import React from 'react';

const ActionButton = ({ title, onClick }) => {
  return (
    <div className="d-flex justify-content-end mb-3">
      <button className="btn btn-primary" onClick={onClick}>
        <i className="bi bi-plus-circle"></i> {title}
      </button>
    </div>
  );
};

export default ActionButton;
