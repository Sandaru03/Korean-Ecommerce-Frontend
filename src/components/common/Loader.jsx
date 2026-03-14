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
        <div className="logo-split samee">
          <img src="/logo.png" alt="Samee" />
        </div>
        <div className="logo-split sadu">
          <img src="/logo.png" alt="Sadu" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
