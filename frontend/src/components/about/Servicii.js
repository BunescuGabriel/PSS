import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import '../../styles/about/Servicii.css';

const ServiceComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/about/servicii')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('Eroare la obținerea datelor:', error);
      });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: 3000,
    afterChange: (index) => setCurrentSlide(index),
  };

  return (
    <div className="Service-container" onMouseEnter={() => setShowArrows(true)} onMouseLeave={() => setShowArrows(false)}>
      <div className="text-overlay">
        <h2 className="title-service">Serviciile Noastre</h2>
        <div className="servicii-caruseli">
         <Slider {...settings} className="servicii-caruseli">
            {services.map((service, index) => (
              <div className="slide-container" key={index}>
                <p>{service.serviciu}</p>
              </div>
            ))}
         </Slider>
        </div>
      </div>
    </div>
  );
};

export default ServiceComponent;



