import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login/Logout.css';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/authen/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          // Logout was successful
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('is_superuser');
          navigate('/');
        } else {
          console.error('Logout error:', response.statusText);
          navigate('/error');
        }
      })
      .catch((error) => {
        console.error('Logout error:', error);
        navigate('/error');
      });
  }, [navigate]);


  return (
    <div>
      Logging out...
    </div>
  );
}

export default Logout;
