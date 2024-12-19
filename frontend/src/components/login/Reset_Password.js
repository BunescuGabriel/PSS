import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login/Forgot.css'; // Make sure to adjust the import path for your CSS file

function ResetPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleResetPassword = () => {
    fetch('http://localhost:8000/api/authen/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        if (data.status === 'success') {
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('A apărut o eroare la resetarea parolei.');
      });
        navigate('/Login');
  };


  return (
    <div className="reset-password-container">
      <h2 className="reset-password-heading">Resetează parola</h2>
      <div className="form-group">
        <label htmlFor="username" className="form-labell">
          Introduceți adresa de e-mail sau numele de utilizator
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Introduceți numele dvs. de utilizator sau e-mailul"
          value={username}
          onChange={handleInputChange}
          className="form-inputt"
        />
      </div>
      <div>
        <button onClick={handleResetPassword} className="reset-button">
          Resetați
        </button>
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default ResetPassword;
