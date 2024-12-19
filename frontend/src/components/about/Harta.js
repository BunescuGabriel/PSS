import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const Intro = () => {
  const mapStyles = {
    height: '400px',
    width: '100%'
  };

  return (
    <LoadScript
      googleMapsApiKey="YOUR_DEVELOPMENT_API_KEY"
    >
      <GoogleMap
        mapContainerStyle={mapStyles}
        center={{
          lat: 47.7624,
          lng: 27.9298
        }}
        zoom={14}
      />
    </LoadScript>
  );
};

export default Intro;
