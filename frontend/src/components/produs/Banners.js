import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/produs/Banners.css';
import 'font-awesome/css/font-awesome.min.css';


const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/produs/banners')
      .then(response => {
        setBanners(response.data);
      })
      .catch(error => {
        console.error('Eroare la obținerea bannerelor:', error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Incrementați indexul imaginii curente pentru a afișa următoarea imagine
      setCurrentSlide((currentSlide + 1) % banners.length);
    }, 5000); // Schimbarea automată la fiecare 5 secunde

    return () => {
      clearInterval(interval);
    };
  }, [currentSlide, banners]);

  const handlePrev = () => {
    setCurrentSlide((currentSlide - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentSlide((currentSlide + 1) % banners.length);
  };

  return (
    <div className="banner-slider" onMouseEnter={() => setShowArrows(true)} onMouseLeave={() => setShowArrows(false)}>
      {showArrows && (
        <div className="arrow left" onClick={handlePrev}>
          <i className="fa fa-chevron-left icon-color"></i>
        </div>
      )}
      <div className="banner-container">
        {banners.length > 0 && (
          <div className="banner-slide">
            <img src={banners[currentSlide].banner} alt={banners[currentSlide].name_banner} />
          </div>
        )}
      </div>
      {showArrows && (
        <div className="arrow right" onClick={handleNext}>
          <i className="fa fa-chevron-right icon-color "></i>
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
