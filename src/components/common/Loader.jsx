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
        <div className="logo-part icon">
          <img src="/logo.png" alt="Logo Icon" />
        </div>
        <div className="logo-part samee">
          <img src="/logo.png" alt="Samee" />
        </div>
        <div className="logo-part and">
          <img src="/logo.png" alt="And" />
        </div>
        <div className="logo-part sandu">
          <img src="/logo.png" alt="Sandu" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
