import React, { useEffect, useState } from 'react';
import './Loader.css';

const Loader = ({ onFinished }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the loader after the animation is supposed to finish
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinished) {
        onFinished();
      }
    }, 2800); // Slightly longer than the animation duration

    return () => clearTimeout(timer);
  }, [onFinished]);

  if (!isVisible) return null;

  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="logo-part">
          <img src="/logo.png" alt="Logo Icon" />
        </div>
        <div className="logo-text-row">
          <div className="logo-text-clip">
            <span className="logo-text-part samee-text">Samee</span>
          </div>
          <div className="logo-text-clip">
            <span className="logo-text-part and-text">And</span>
          </div>
          <div className="logo-text-clip">
            <span className="logo-text-part sandu-text">Sandu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
