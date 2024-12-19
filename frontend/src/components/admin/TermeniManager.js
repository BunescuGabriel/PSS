import React, { useState, useEffect } from 'react';
import '../../styles/admin/TermeniManager.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const TermeniManager = () => {
  const [termeni, setTermeni] = useState([]);
  const [userIsSuperUser, setUserIsSuperUser] = useState(false);
  const [newTermenData, setNewTermenData] = useState({
    titlu: '',
    descrierea: '',
    text: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedTermen, setSelectedTermen] = useState(null);


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
            console.log(setUserIsSuperUser)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user access:', error);
    }
  };

  const fetchTermeni = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/about/terminii');
      setTermeni(response.data);
    } catch (error) {
      console.error('There was a problem fetching the data:', error);
    }
  };

  useEffect(() => {
    fetchUserAccess();
    fetchTermeni();
  }, []);

  const handleSelectTermen = (termen) => {
  setSelectedTermen(termen);
  // Populează formularul cu datele termenului selectat
  setNewTermenData({
    titlu: termen.titlu,
    descrierea: termen.descrierea,
    text: termen.text || '', // Asigură că textul nu este null
  });
  setShowForm(true); // Arată formularul pentru actualizare
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTermenData({ ...newTermenData, [name]: value });
  };
  const toggleForm = () => {
    setShowForm(!showForm);
    setNewTermenData({ titlu: '', descrierea: '', text: '' }); // Reset form fields when toggling
  };

  const adaugaTermen = async () => {
  try {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    if (userIsSuperUser === true && storedAccessToken) {
      const dataToSend = { ...newTermenData };

      if (dataToSend.text === '') {
        dataToSend.text = null; // Setează câmpul text la null când este gol
      }

      const response = await axios.post(
        'http://localhost:8000/api/about/termini',
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedAccessToken}`,
          },
        }
      );

      if (response.status === 201) {
        fetchTermeni();
        toggleForm(); // Ascunde formularul după adăugare
      } else {
        throw new Error('Failed to add term: Network response was not ok');
      }
    } else {
      console.error('Permission denied: You are not a super user or missing access token.');
    }
  } catch (error) {
    console.error('There was a problem adding the term:', error);
    // Tratează erorile sau afișează un mesaj pentru utilizator
  }
};


  const stergeTermen = async (termeniId) => {
    try {
      const storedAccessToken = sessionStorage.getItem('accessToken');
      if (userIsSuperUser && storedAccessToken) {
        await axios.delete(`http://localhost:8000/api/about/termini/${termeniId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedAccessToken}`,
          },
        });
        fetchTermeni();
      } else {
        console.error('Permission denied: You are not a super user or missing access token.');
      }
    } catch (error) {
      console.error('Error deleting term:', error);
    }
  };

  const actualizeazaTermen = async () => {
  try {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    if (userIsSuperUser && storedAccessToken && selectedTermen) {
      const dataToUpdate = { ...newTermenData };

      if (dataToUpdate.text === '') {
        dataToUpdate.text = null; // Setează câmpul text la null când este gol
      }

      const response = await axios.put(
        `http://localhost:8000/api/about/termini/${selectedTermen.id}`,
        dataToUpdate,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedAccessToken}`,
          },
        }
      );

      if (response.status === 200) {
        fetchTermeni();
        toggleForm(); // Ascunde formularul după actualizare
        setSelectedTermen(null); // Resetează termenul selectat
      } else {
        throw new Error('Failed to update term: Network response was not ok');
      }
    } else {
      console.error('Permission denied or missing data.');
    }
  } catch (error) {
    console.error('There was a problem updating the term:', error);
    // Tratează erorile sau afișează un mesaj pentru utilizator
  }
};


  return (
    <div className="termeni-container">
      {showForm ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <textarea
            type="text"
            name="titlu"
            value={newTermenData.titlu}
            placeholder="Titlu"
            onChange={handleChange}
          />
          <textarea
            type="text"
            name="descrierea"
            value={newTermenData.descrierea}
            placeholder="Descriere"
            onChange={handleChange}
          />
          <textarea
            name="text"
            value={newTermenData.text}
            placeholder="Text (opțional)"
            onChange={handleChange}
          />
          <div>
            <button onClick={selectedTermen ? actualizeazaTermen : adaugaTermen}
               style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px',marginRight: '20px' }}
              >
              {selectedTermen ? 'Actualizează' : 'Adaugă'}
            </button>
            <button onClick={toggleForm}
                style={{ backgroundColor: 'darkred', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px',marginRight: '20px' }}
            >Închide
            </button>
          </div>
        </form>
      ) : (
        <button
          style={{ backgroundColor: 'green'}}
            onClick={toggleForm}>Adaugă termen nou
        </button>
      )}

      <ul className="termeni-list">
        {termeni.map((termen) => (
          <div key={termen.id} className="termen-item">
            <h3 className="Title">* {termen.titlu}</h3>
            <p className="text">{termen.descrierea}</p>
            <p className="text2">{termen.text}</p>
            {userIsSuperUser && (
              <>
                <button onClick={() => stergeTermen(termen.id)}
                style={{ backgroundColor: 'lightgray', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px',marginRight: '20px' }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} style={{ color: 'red' }}/>
                </button>

                <button onClick={() => handleSelectTermen(termen)}
                style={{ backgroundColor: 'lightgray', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px',marginRight: '20px' }}
                >
                  <FontAwesomeIcon icon={faSyncAlt} style={{ color: 'green' }}/>
                </button>
              </>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TermeniManager;
