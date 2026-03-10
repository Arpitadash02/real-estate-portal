import React from 'react';

const Loader = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }
  return (
    <div className="loader-overlay">
      <div className="spinner" />
    </div>
  );
};

export default Loader;
