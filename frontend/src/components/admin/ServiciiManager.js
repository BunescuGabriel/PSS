import React, { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import '../../styles/admin/ServiciiManager.css';
import {faSyncAlt, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ServiciiManager = () => {
  const [services, setServices] = useState([]);
  const [userIsSuperUser, setUserIsSuperUser] = useState(false);
  const [newService, setNewService] = useState('');
  const [updateServiceId, setUpdateServiceId] = useState(null);
  const [updatedService, setUpdatedService] = useState('');

  useEffect(() => {
    fetchUserAccess();
    refreshData();
  }, []);

  const fetchUserAccess = async () => {
    try {
      const storedAccessToken = sessionStorage.getItem('accessToken');
      if (storedAccessToken) {
        const response = await axios.get('http://localhost:8000/api/users/users-profile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedAccessToken}`,
          },
        });
        if (response.status === 200 && response.data.length > 0) {
          const user = response.data[0];
          if (user.user && user.user.email) {
            const userEmail = user.user.email;
            const userResponse = await axios.get(`http://localhost:8000/api/users/get-user-id-by-email/${userEmail}/`);
            setUserIsSuperUser(userResponse.data.is_superuser > 0);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user access:', error);
    }
  };

  const refreshData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/about/servicii');
      setServices(response.data);
    } catch (error) {
      console.error('Error refreshing services:', error);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const storedAccessToken = sessionStorage.getItem('accessToken');

    if (userIsSuperUser && storedAccessToken) {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/about/servicii',
          { serviciu: newService },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storedAccessToken}`,
            },
          }
        );
        setServices([...services, response.data]);
        setNewService('');
        refreshData();
      } catch (error) {
        console.error('Error adding service:', error);
      }
    } else {
      console.error('Permission denied or missing access token.');
    }
  };

   const handleServiceUpdate = async (service) => {
    if (updateServiceId === service.id) {
      const storedAccessToken = sessionStorage.getItem('accessToken');
      if (userIsSuperUser && storedAccessToken) {
        try {
          if (updatedService !== '') { // Verificăm dacă s-a introdus un nou serviciu pentru a face actualizarea
            const response = await axios.put(
              `http://localhost:8000/api/about/servicii/${service.id}`,
              { serviciu: updatedService || service.serviciu }, // utilizează serviciul actualizat sau cel existent
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${storedAccessToken}`,
                },
              }
            );
            refreshData(); // Actualizează lista de servicii după modificare
          }
          setUpdateServiceId(null); // Resetează id-ul pentru a închide inputul de modificare
          setUpdatedService(''); // Resetează valoarea inputului pentru serviciul actualizat
        } catch (error) {
          console.error('Error updating service:', error);
        }
      } else {
        console.error('Permission denied or missing access token.');
      }
    } else {
      setUpdateServiceId(service.id); // Deschide inputul pentru a modifica serviciul
      setUpdatedService(service.serviciu); // Inițializează valoarea inputului cu serviciul actual
    }
  };

  const handleServiceDelete = async (serviceId) => {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    if (userIsSuperUser && storedAccessToken) {
      try {
        await axios.delete(`http://localhost:8000/api/about/servicii/${serviceId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedAccessToken}`,
          },
        });
        refreshData(); // Actualizați lista de servicii după ștergere
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    } else {
      console.error('Permission denied or missing access token.');
    }
  };

  return (
    <div className="service-containerr">
      <div className="add-service-formm">
        <form onSubmit={handleServiceSubmit}>
          <textarea
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="Enter new service"
          />
          <button type="submit">Adăugați serviciu</button>
        </form>
      </div>

      <div className="service-listt">
        <h2 className="service-titlee">List of Services</h2>
        <div className="service-itemsm">
          {services.slice().reverse().map((service, index) => (
            <div className="service-item" key={index}>
              {updateServiceId === service.id ? (
                <div className={"Create--service"}>
                  <textarea
                    type="text"
                    value={updatedService}
                    onChange={(e) => setUpdatedService(e.target.value)}
                    placeholder="Update service"
                  />
                  <button onClick={() => handleServiceUpdate(service)}>Salvează</button>
                  <button onClick={() => setUpdateServiceId(null)}>Închide</button>
                </div>
              ) : (
                <p>{service.serviciu}</p>
              )}
              {userIsSuperUser && (
                <>
                  {updateServiceId !== service.id && (
                    <button onClick={() => handleServiceUpdate(service)}>
                      <FontAwesomeIcon icon={faSyncAlt} style={{ color: 'lightgreen' }}/>
                    </button>
                  )}
                  <button onClick={() => handleServiceDelete(service.id)}>
                    <FontAwesomeIcon icon={faTrashAlt} style={{ color: 'red' }}/>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiciiManager;

