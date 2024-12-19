import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../../styles/profile/Address.css';

const Address = () => {
  const [userAddress, setuserAddress] = useState({
    country: '',
    city: '',
    street: '',
    house_number: '',
    apartment: '',
  });
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    street: '',
    house_number: '',
    apartment: '',
  });
  const [showEditForm, setShowEditForm] = useState(false);



  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem("accessToken"); // Utilizare sessionStorage

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateAddress = async () => {
    try {
      // Obiect pentru actualizarea profilului
      const updatedData = {};
      for (const key in formData) {
        if (formData[key] !== '') {
          updatedData[key] = formData[key];
        }
      }

      if (Object.keys(updatedData).length === 0) {
        // Nu sunt câmpuri de actualizat
        return;
      }

      // Adăugați obiectul adresei la obiectul de actualizare a profilului

      const response = await axios.patch(
        'http://localhost:8000/api/users/address',
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        // După actualizare, reîncărcați datele utilizatorului
        loadData();
        setShowEditForm(false);
      } else {
        // Tratați cazurile de eroare aici
      }
    } catch (error) {
      // Tratați erorile aici
    }
  };

  const loadData = async () => {
    try {
      const storedAccessToken = sessionStorage.getItem("accessToken"); // Utilizare sessionStorage

      if (storedAccessToken) {
        const userAddressResponse = await axios.get('http://localhost:8000/api/users/address', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedAccessToken}`,
          },
        });
        if (userAddressResponse.status === 200 && userAddressResponse.data.length > 0) {
          const user = userAddressResponse.data[0];
          setuserAddress({
            country: user.country,
            city: user.city,
            street: user.street,
            house_number: user.house_number,
            apartment: user.apartment,
          });
          setLoading(false);
        } else {
          console.error('Error loading data:', userAddressResponse);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [navigate, accessToken]);

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  return (
    <div className="address-container">
      <div className="settings-panell">
        </div>
        <div className="profile-info">
          <h1 className="address-title">User Address</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="address-item">
              <p>Country: {userAddress.country}</p>
              <p>City: {userAddress.city}</p>
              <p>Street: {userAddress.street}</p>
              <p>House Number: {userAddress.house_number}</p>
              <p>Apartment: {userAddress.apartment}</p>
              <button onClick={handleEditClick} className="edit-button">Edit</button>
            </div>
          )}

          {showEditForm && (
            <div className="popup">
              <div className="popup-content">
                <h2 className="edit-title">Edit Address:</h2>
                <form>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="edit-input"
                  />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="edit-input"
                  />
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Street"
                    className="edit-input"
                  />
                  <input
                    type="text"
                    name="house_number"
                    value={formData.house_number}
                    onChange={handleChange}
                    placeholder="House Number"
                    className="edit-input"
                  />
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="Apartment"
                    className="edit-input"
                  />
                  <button type="button" onClick={handleUpdateAddress} className="update-button-ad">
                    Update Profile
                  </button>
                  <button type="button" onClick={handleCloseEditForm} className="close-button-ad">
                    Close
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

    </div>
  );
};

export default Address;
