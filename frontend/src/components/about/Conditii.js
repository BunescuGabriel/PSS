import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/about/ConditiiComponent.css';

const ConditiiComponent = () => {
  const [conditions, setConditions] = useState([]);
  const [descriptions, setDescriptions] = useState({});

  useEffect(() => {
    // Fetch all conditions
    axios.get('http://localhost:8000/api/about/conditi/')
      .then(response => {
        setConditions(response.data);
      })
      .catch(error => {
        console.error('Error fetching conditions:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch descriptions for each condition
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

  return (
    <div className="conditii-container">
      {/*<h2 className="conditii-heading">Condiții</h2>*/}
      {conditions.map((condition, index) => (
        <div className="condition-item" key={condition.id}>
          <h3 className="condition-title">{`${romanize(index + 1)}. ${condition.titlu}`}</h3>
          <p className="condition-text">{condition.text}</p>
          {descriptions[condition.id] ? (
            <ol className="description-list">
              {descriptions[condition.id].map((description, idx) => (
                <li className="description-item" key={description.id}>
                  <span className="custom-counter">{`${idx + 1})`}</span>{description.descrierea}
                </li>
              ))}
            </ol>
          ) : (
            <p className="loading-description">Loading description...</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConditiiComponent;

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

