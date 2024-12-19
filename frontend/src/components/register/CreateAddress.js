import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/register/CreateAddress.css';


const CreateAddress = ({ userData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    street: '',
    house_number: '',
    apartment: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAddress = async () => {
    const { country, city, street, house_number, apartment } = formData;

    if (!userData || !userData.id) {
      console.error('User data is missing or does not contain an ID.');
      return;
    }

    const userId = userData.id;

    // Verificați dacă fiecare câmp este gol și setați-l ca "null" dacă este cazul
    const requestData = {
      user_id: userId,
      country: country || null,
      city: city || null,
      street: street || null,
      house_number: house_number || null,
      apartment: apartment || null,
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/users/create-address',
        requestData,
      );

      console.log('Address created:', response.data);
        navigate('/login');
    } catch (error) {
      console.error('Error creating address:', error.message);
      // Afișați un mesaj de eroare pentru utilizator
    }
  };

  return (
    <div>
      <div className="Address-container">
        <div className="Address-info">
          <h1 className="create-profile">Create Address</h1>
          <h2 className="sub-titt">*Do not necessarily fill, click continue Create Address registration!</h2>
          <div>
            <form>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="input-country" // Adaugă o clasă pentru stilizarea acestui element
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="input-city" // Adaugă o clasă pentru stilizarea acestui element
              />
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street"
                className="input-street" // Adaugă o clasă pentru stilizarea acestui element
              />
              <input
                type="text"
                name="house_number"
                value={formData.house_number}
                onChange={handleChange}
                placeholder="House Number"
                className="input-house-number" // Adaugă o clasă pentru stilizarea acestui element
              />
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                placeholder="Apartment"
                className="input-apartment" // Adaugă o clasă pentru stilizarea acestui element
              />
              <button type="button" onClick={handleCreateAddress} className="create-button-address">
                Create Address
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAddress;
