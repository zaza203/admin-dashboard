import React from 'react';

const CardComponent = ({ title, value }) => {
  return (
    <div className="col-md-4">
      <div className="bg-white rounded z-0 p-3" style={{ boxShadow: "0px 0px 9.2px 0px rgba(0, 0, 0, 0.08)" }}>
        <h5>{title}</h5>
        <p className="fs-3 fw-bold">{value}</p>
      </div>
    </div>
  );
};

export default CardComponent;
