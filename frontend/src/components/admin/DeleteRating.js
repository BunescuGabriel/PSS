import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../styles/produs/Comments.css';
import { format } from 'date-fns';

const DeleteRating = ({ productId }) => {
  const [ratings, setRatings] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [userIsSuperUser, setUserIsSuperUser] = useState(false);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/profile/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const fetchUserAccess = async () => {
    try {
      const storedAccessToken = sessionStorage.getItem('accessToken');
      if (storedAccessToken) {
        const response = await axios.get('http://localhost:8000/api/users/users-profile', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedAccessToken}`,
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

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/produs/ratings-list/${productId}`);
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  useEffect(() => {
    fetchRatings();
    fetchUserAccess();
  }, [productId]);

  useEffect(() => {
    const fetchUserNames = async () => {
      const userNamesData = {};
      for (const rating of ratings) {
        const userInfo = await fetchUserInfo(rating.user_id);
        if (userInfo) {
          userNamesData[rating.user_id] = {
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
            avatar: userInfo.avatar,
          };
        }
      }
      setUserNames(userNamesData);
    };

    if (ratings.length > 0) {
      fetchUserNames();
    }
  }, [ratings]);

  const handleDeleteRating = (ratingId) => {
    if (userIsSuperUser) {
      axios
        .delete(`http://localhost:8000/api/produs/car/${productId}/rating/${ratingId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        })
        .then(() => {
          fetchRatings();
        })
        .catch((error) => {
          console.error('Error deleting rating:', error);
        });
    } else {
      console.error('Permission denied: You are not a super user.');
    }
  };

  return (
    <div className="comments-container">
      <ul className="comments-list">
        {ratings.slice().reverse().map((rating) => (
          <li key={rating.id} className="comment-item">
            <div className="user-info">
              {userNames[rating.user_id] ? (
                <img
                  src={userNames[rating.user_id].avatar}
                  alt={`Avatar for ${userNames[rating.user_id].firstName} ${userNames[rating.user_id].lastName}`}
                  className="avatar"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className="avatar" />
              )}
              <div className="user-details">
                <p className="user-name">
                  {userNames[rating.user_id]
                    ? `${userNames[rating.user_id].firstName} ${userNames[rating.user_id].lastName}`
                    : 'Unknown User'}
                </p>
                <p className="comment-text">{rating.rating}</p>
              </div>
            </div>
            <p className="comment-date">
              {format(new Date(rating.create_da), 'dd.MM.yyyy HH:mm')}
            </p>
            <FontAwesomeIcon
              icon={faTimes}
              className="deletee-icon"
              onClick={() => handleDeleteRating(rating.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeleteRating;
