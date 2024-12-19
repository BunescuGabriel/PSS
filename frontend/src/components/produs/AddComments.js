import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/produs/AddComments.css';

const AddComment = ({ productId }) => {
  const [comment, setComment] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track user login status

  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem('accessToken'); // Use sessionStorage
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      loadUserEmail(storedAccessToken);
      setIsLoggedIn(true); // User is logged in
    }
  }, []);

  const loadUserEmail = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/users-profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data.length > 0) {
        const user = response.data[0];
        if (user.user && user.user.email) {
          setUserEmail(user.user.email);
          fetchUserIdByEmail(user.user.email);
        }
      }
    } catch (error) {
      setError('Eroare la obținerea adresei de email.');
    }
  };

  const fetchUserIdByEmail = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/get-user-id-by-email/${email}/`);

      if (response.status === 200 && response.data.user_id) {
        setUserId(response.data.user_id);
      } else {
        setError('Eroare la obținerea ID-ului utilizatorului.');
      }
    } catch (error) {
      setError('Eroare la obținerea ID-ului utilizatorului.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (isLoggedIn && userId) {
        const commentResponse = await axios.post('http://localhost:8000/api/produs/comments', {
          comment: comment,
          produs: productId,
          user_id: userId,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        setComment('');
      } else {
        // Notify the user to log in
        setError('Trebuie să vă autentificați pentru a adăuga un comentariu.');
      }
    } catch (error) {
      setError('Eroare la adăugarea comentariului.');
    }
  };

  return (
    <div className="comment-container">
      <textarea
        rows="4"
        cols="50"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Adăugați un comentariu"
      ></textarea>
      <button onClick={handleSubmit}>Adăugați Comentariu</button>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
};

export default AddComment;
