import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin/ConditiiManager.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const ConditiiManager = (effect, deps) => {
  const [conditions, setConditions] = useState([]);
  const [descriptions, setDescriptions] = useState({});
  const [newCondition, setNewCondition] = useState({
    titlu: '',
    text: '',
  });
  const [newDescription, setNewDescription] = useState({
    conditi: null,
    descrierea: '',
  });
  const [userIsSuperUser, setUserIsSuperUser] = useState(false);
  const [showAddConditionForm, setShowAddConditionForm] = useState(false);
  const [showAddDescriptionForm, setShowAddDescriptionForm] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [SelectedDescrierea, setSelectedDescrierea] = useState(null);


  const handleSelectCondition = (condition) => {
  setSelectedCondition(condition);
  setNewCondition({
    titlu: condition.titlu,
    text: condition.text || '', // Asigură că textul nu este null
  });
  setShowAddConditionForm(true); // Arată formularul pentru actualizare
};
  const handleSelectDescrierea = (descrierea) => {
  setSelectedDescrierea(descrierea);
  setNewDescription({
    conditi: descrierea.conditi,
    descrierea: descrierea.descrierea || '', // Asigură că textul nu este null
  });
  setShowAddDescriptionForm(true); // Arată formularul pentru actualizare
};


  const toggleAddConditionForm = () => {
    setShowAddConditionForm(!showAddConditionForm);
    setNewCondition({ titlu: '', text: '' }); // Reset form fields when toggling
  };

  const toggleAddDescriptionForm = () => {
    setShowAddDescriptionForm(!showAddDescriptionForm);
    setNewDescription({ conditi: null, descrierea: '' }); // Reset form fields when toggling
  };

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

  useEffect(() => {
    fetchUserAccess();
    axios.get('http://localhost:8000/api/about/conditi/')
      .then(response => {
        setConditions(response.data);
      })
      .catch(error => {
        console.error('Error fetching conditions:', error);
      });
  }, []);

  useEffect(() => {
    conditions.forEach(condition => {
      axios.get(`http://localhost:8000/api/about/conditii/${condition.id}`)
        .then(response => {
          setDescriptions(prevDescriptions => ({
            ...prevDescriptions,
            [condition.id]: response.data.descrierii,
          }));
        })
        .catch(error => {
          console.error(`Error fetching condition ${condition.id} details:`, error);
        });
    });
  }, [conditions]);

  const refreshData = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/about/conditi/');
    setConditions(response.data);
  } catch (error) {
    console.error('Error refreshing conditions:', error);
  }
};

  const addCondition = async () => {
    try {
      const storedAccessToken = sessionStorage.getItem('accessToken');
      if (userIsSuperUser && storedAccessToken) {
        const dataToSend = { ...newCondition };

        if (dataToSend.text === '') {
          dataToSend.text = null;
        }

        const response = await axios.post(
          'http://localhost:8000/api/about/conditii',
          dataToSend,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storedAccessToken}`,
            },
          }
        );

        if (response.status === 201) {
          setNewCondition({ titlu: '', text: '' });
          refreshData();
        } else {
          throw new Error('Failed to add condition: Network response was not ok');
        }
      } else {
        console.error('Permission denied: You are not a super user or missing access token.');
      }
    } catch (error) {
      console.error('There was a problem adding the condition:', error);
    }
  };

  const addDescription = async () => {
    try {
      const storedAccessToken = sessionStorage.getItem('accessToken');
      if (userIsSuperUser && storedAccessToken) {
        const response = await axios.post(
          'http://localhost:8000/api/about/descriere',
          newDescription,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storedAccessToken}`,
            },
          }
        );

        if (response.status === 201) {
          console.log('Description added successfully:', response.data);
          const updatedDescriptions = {
            ...descriptions,
            [newDescription.conditi]: [
              ...(descriptions[newDescription.conditi] || []),
              response.data,
            ],
          };
          setDescriptions(updatedDescriptions);
          setNewDescription({ ...newDescription, descrierea: '' }); // Șterge doar textul descrierii pentru o nouă adăugare
        } else {
          throw new Error('Failed to add description: Network response was not ok');
        }
      } else {
        console.error('Permission denied: You are not a super user or missing access token.');
      }
    } catch (error) {
      console.error('Error adding description:', error);
    }
  };

  const stergeConditii = async (conditiId) => {
    try {
      const storedAccessToken = sessionStorage.getItem('accessToken');
      if (userIsSuperUser && storedAccessToken) {
        await axios.delete(`http://localhost:8000/api/about/conditi/${conditiId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedAccessToken}`,
          },
        });
        refreshData();
      } else {
        console.error('Permission denied: You are not a super user or missing access token.');
      }
    } catch (error) {
      console.error('Error deleting term:', error);
    }
  };

  const stergeDescriere = async (descriereId) => {
    try {
      const storedAccessToken = sessionStorage.getItem('accessToken');
      if (userIsSuperUser && storedAccessToken) {
        await axios.delete(`http://localhost:8000/api/about/descriere/${descriereId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedAccessToken}`,
          },
        });
        refreshData();
      } else {
        console.error('Permission denied: You are not a super user or missing access token.');
      }
    } catch (error) {
      console.error('Error deleting term:', error);
    }
  };

  const updateCondition = async () => {
  try {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    if (userIsSuperUser && storedAccessToken && selectedCondition) {
      const dataToUpdate = { ...newCondition };

      if (dataToUpdate.text === '') {
        dataToUpdate.text = null;
      }

      const response = await axios.put(
        `http://localhost:8000/api/about/conditi/${selectedCondition.id}`,
        dataToUpdate,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedAccessToken}`,
          },
        }
      );

      if (response.status === 200) {
        refreshData();
        toggleAddConditionForm();
        setSelectedCondition(null);
      } else {
        throw new Error('Failed to update condition: Network response was not ok');
      }
    } else {
      console.error('Permission denied or missing data.');
    }
  } catch (error) {
    console.error('There was a problem updating the condition:', error);
    // Gestionează erorile sau afișează un mesaj pentru utilizator
  }
};

const updateDescrierea = async () => {
  try {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    if (userIsSuperUser && storedAccessToken && SelectedDescrierea) {
      const dataToUpdate = { ...newDescription };

      const response = await axios.put(
        `http://localhost:8000/api/about/descriere/${SelectedDescrierea.id}`,
        dataToUpdate,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedAccessToken}`,
          },
        }
      );

      if (response.status === 200) {
        refreshData();
        toggleAddDescriptionForm();
        setSelectedDescrierea(null);
      } else {
        throw new Error('Failed to update description: Network response was not ok');
      }
    } else {
      console.error('Permission denied or missing data.');
    }
  } catch (error) {
    console.error('There was a problem updating the description:', error);
    // Gestionează erorile sau afișează un mesaj pentru utilizator
  }
};




  return (
    <div className="conditii-container">
      <div className="add-condition-form">
        {showAddConditionForm ? (
          <form onSubmit={(e) => e.preventDefault()}>
            <textarea
              type="text"
              placeholder="Titlu"
              value={newCondition.titlu}
              onChange={(e) => setNewCondition({ ...newCondition, titlu: e.target.value })}
            />
            <textarea
              type="text"
              placeholder="Text"
              value={newCondition.text}
              onChange={(e) => setNewCondition({ ...newCondition, text: e.target.value })}
            />
            <div>
              <button onClick={addCondition}>Adaugă condiție</button>
              <button onClick={selectedCondition ? updateCondition : addCondition}>
                {selectedCondition ? 'Actualizează' : 'Adaugă'}
              </button>
              <button onClick={toggleAddConditionForm}>Închide</button>
            </div>
          </form>
        ) : (
          <button onClick={toggleAddConditionForm}>Adaugă condiție nouă</button>
        )}
      </div>

      <div className="add-description-form">
        {showAddDescriptionForm ? (
          <form onSubmit={(e) => e.preventDefault()}>
          <select
            value={newDescription.conditi}
            onChange={(e) => setNewDescription({ ...newDescription, conditi: e.target.value })}
            >
              <option value="">Selectează condiția</option>
                {conditions.map((condition) => (
                <option key={condition.id} value={condition.id}>{condition.titlu}</option>
            ))}
          </select>
        <textarea
          type="text"
          placeholder="Descriere"
          value={newDescription.descrierea}
          onChange={(e) => setNewDescription({ ...newDescription, descrierea: e.target.value })}
        />
              <div>
              <button onClick={addDescription}>Adaugă descriere</button>
                <button onClick={SelectedDescrierea ? updateDescrierea : addDescription}>
                {SelectedDescrierea ? 'Actualizează' : 'Adaugă'}
                </button>
              <button onClick={toggleAddDescriptionForm}>Închide</button>
            </div>
        </form>
        ) : (
          <button onClick={toggleAddDescriptionForm}>Adaugă descriere nouă</button>
        )}
      </div>


      {conditions.map((condition, index) => (
        <div className="condition-item" key={condition.id}>
          <h3 className="condition-title">{`${romanize(index + 1)}. ${condition.titlu}`}</h3>
          <p className="condition-text">{condition.text}</p>
          {descriptions[condition.id] ? (
            <ol className="description-list">
              {descriptions[condition.id].map((description, idx) => (
                <li className="description-item" key={description.id}>
                  <span className="custom-counter">{`${idx + 1})`}</span>{description.descrierea}
                  {userIsSuperUser && (
              <>
                <button className={"edit-buttonn"} onClick={() => stergeDescriere(description.id)}>
                  <FontAwesomeIcon icon={faTrashAlt} style={{ color: 'red' }}/>
                  </button>
                <button className={"edit-buttonn"} onClick={() => handleSelectDescrierea(description)}>
                  <FontAwesomeIcon icon={faSyncAlt} style={{ color: 'green' }}/>
                </button>
              </>
            )}
                </li>
              ))}
            </ol>
          ) : (
            <p className="loading-description">Loading description...</p>
          )}

          {userIsSuperUser && (
              <>
                <button className={"edit-buttonn"} onClick={() => stergeConditii(condition.id)}>
                  <FontAwesomeIcon icon={faTrashAlt} style={{ color: 'red' }}/>
                  </button>
                <button className={"edit-buttonn"} onClick={() => handleSelectCondition(condition)}>
                  <FontAwesomeIcon icon={faSyncAlt} style={{ color: 'green' }}/>
                  </button>
              </>
            )}

        </div>
      ))}
    </div>
  );
};

export default ConditiiManager;

function romanize(number) {
  const romanNumerals = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
    6: 'VI',
    7: 'VII',
    8: 'VIII',
    9: 'IX',
    10: 'X',
  };

  return romanNumerals[number] || number.toString();
}
