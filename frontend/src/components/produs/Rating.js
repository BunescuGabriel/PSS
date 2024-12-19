import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/produs/Rating.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Rating = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [hasUserRated, setHasUserRated] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedRating, setHasFetchedRating] = useState(false);

  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      loadUserEmail(storedAccessToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && accessToken && productId && !hasUserRated && !isLoading && !hasFetchedRating) {
      fetchUserRating();
    }
  }, [productId, isLoggedIn, accessToken, hasUserRated, isLoading, hasFetchedRating]);

  const fetchUserRating = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/produs/ratings/${productId}/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200 && response.data.rating) {
        setRating(response.data.rating);
        setHasUserRated(true);
      } else {
        setRating(0);
        setHasUserRated(false);
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
    } finally {
      setIsLoading(false);
      setHasFetchedRating(true);
    }
  };

  const loadUserEmail = async (token) => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/users/users-profile',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.length > 0) {
        const user = response.data[0];
        if (user.user && user.user.email) {
          setUserEmail(user.user.email);
          fetchUserIdByEmail(user.user.email);
        }
      }
    } catch (error) {
      console.error('Error loading user email:', error);
    }
  };

  const fetchUserIdByEmail = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/get-user-id-by-email/${email}/`
      );

      if (response.status === 200 && response.data.user_id) {
        setUserId(response.data.user_id);
      } else {
        console.error('Error fetching user ID by email.');
      }
    } catch (error) {
      console.error('Error fetching user ID by email:', error);
    }
  };

  const handleRatingChange = async (newRating) => {
    try {
      await handleRateProduct(newRating);
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };

  const handleRateProduct = async (newRating) => {
    try {
      if (isLoggedIn && userId) {
        const ratingResponse = await axios.post(
          'http://localhost:8000/api/produs/ratings/',
          {
            rating: newRating,
            produs: productId,
            user_id: userId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (ratingResponse.status === 201) {
          setRating(newRating);
          setHasUserRated(true);
        } else {
          console.error('Error adding rating:', ratingResponse);
        }
      } else {
        console.log(
          'Utilizatorul nu este autentificat. Vă rugăm să vă autentificați pentru a evalua produsul.'
        );
      }
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };

  const renderStars = () => {
    const starIcons = [];
    for (let i = 1; i <= 5; i++) {
      starIcons.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={`star-icon ${i <= rating ? 'selected' : ''}`}
          onClick={() => handleRatingChange(i)}
        />
      );
    }
    return starIcons;
  };

  return (
    <div>
      <div className="star-rating">
        {renderStars()}
      </div>
    </div>
  );
};

export default Rating;
