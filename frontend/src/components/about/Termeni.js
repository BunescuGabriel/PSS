import React, { useState, useEffect } from 'react';
import '../../styles/about/TermeniComponent.css';

const TermeniComponent = () => {
  const [termeni, setTermeni] = useState([]);

  useEffect(() => {
    async function fetchTermeni() {
      try {
        const response = await fetch('http://localhost:8000/api/about/terminii', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Poți adăuga aici token-ul de autentificare, dacă este necesar
            // 'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setTermeni(data);
      } catch (error) {
        console.error('There was a problem fetching the data:', error);
        // Poți adăuga aici logica pentru tratarea erorilor sau afișarea unui mesaj către utilizator
      }
    }

    fetchTermeni();
  }, []);

  return (
    <div className="termeni-container">
      {/*<h1 className={"Titluu"}>Termeni</h1>*/}
      <ul className="termeni-list">
        {termeni.map((termen) => (
          <p key={termen.id} className="termen-item">
            <h3 className={"Title"}>* {termen.titlu}</h3>
            <p className={"text"}>{termen.descrierea}</p>
            <p className={"text2"}>{termen.text}</p>
          </p>
        ))}
        <p className="text3">
        <strong>*</strong>   <strong>SupremeRentals</strong> își rezervă dreptul de a nu oferi automobil în chirie unor persoane, fără a da careva explicații!
      </p>
      </ul>
    </div>
  );
}

export default TermeniComponent;



