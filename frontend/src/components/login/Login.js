import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/login/Login.css';

const baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.baseURL = `${baseURL}/authen`;

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordToggleActive, setPasswordToggleActive] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    setPasswordToggleActive(!passwordToggleActive);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username) {
      alertError('Please enter your username.');
      return;
    }

    if (!formData.password) {
      alertError('Please enter your password.');
      return;
    }

    try {
      const response = await axios.post('/login', formData);

      if (response.status === 200) {
        const data = response.data;
        sessionStorage.setItem('accessToken', data.access_token);
        sessionStorage.setItem('is_superuser', data.is_superuser);

        if (data.is_superuser > 0) {
          // Redirect superusers to the protected /admin route
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alertError('Invalid username or password.');
      }
    } catch (error) {
      alertError('Incorrect username or password.');
    }
  };

  const alertError = (message) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-error';
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  };

  return (
    <div className="login">
      <h2 className="login-title">Autentificare</h2>
      <h3 className="login-subtitle">pentru a avea acces la fișierele dvs.</h3>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="username" className="input-label">Nume de utilizator sau e-mail</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Introduceți numele de utilizator sau adresa de e-mail"
            value={formData.username}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="input-label">
            Parola    <Link to="/reset-password" className="forgot-password-link">Ați uitat parola?</Link>
          </label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Introduceți parola"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
            />
            <span
              className={`password-toggle ${passwordToggleActive ? 'active' : ''}`}
              onClick={toggleShowPassword}
            >
              {showPassword ? '👁' : '👁'}
            </span>
          </div>
        </div>
        <button type="submit" className="login-button">Autentificare</button>
      </form>
      <div className="register-link">
        <h3>Don't have an account? <Link to="/register" className="register-link">Crează-ți un cont</Link></h3>
      </div>
    </div>
  );
}

export default Login;
