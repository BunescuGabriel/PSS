import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/about/DespreComponent.css';

const AboutComponent = () => {
  const [conditions, setConditions] = useState([]);
  const [descriptions, setDescriptions] = useState({});

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/about/despre/');
        setConditions(response.data);
      } catch (error) {
        console.error('Error fetching conditions:', error);
      }
    };

    fetchConditions();
  }, []);

  useEffect(() => {
    const fetchDescriptions = async () => {
      try {
        const descriptionsData = {};
        for (const condition of conditions) {
          const response = await axios.get(`http://localhost:8000/api/about/despre/${condition.id}/`);
          descriptionsData[condition.id] = response.data.detalii;
        }
        setDescriptions(descriptionsData);
      } catch (error) {
        console.error('Error fetching condition details:', error);
      }
    };

    if (conditions.length > 0) {
      fetchDescriptions();
    }
  }, [conditions]);



  return (
    <div className="conditii-containerr">
      <h2 className="conditii-headingg">Despre noi</h2>
      <h3 className="conditii-sub">
        Supreme Rentals este o agenție de Închirieri Auto în R.Moldova, care are drept scop prestarea serviciilor de nișă, cu o experiență de primă clasă.
      </h3>
      {conditions.map((condition, index) => (
        <div className="condition-itemm" key={condition.id}>
          <h3 className="condition-titlee">{condition.titlu}</h3>
          {descriptions[condition.id] ? (
            <ol className="description-listt">
              {descriptions[condition.id].map((description) => (
                <li className="description-itemm" key={description.id}>
                  <span className="custom-counterr"></span>{description.detali}
                </li>
              ))}
            </ol>
          ) : (
            <p className="loading-descriptionn">Loading description...</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AboutComponent;
