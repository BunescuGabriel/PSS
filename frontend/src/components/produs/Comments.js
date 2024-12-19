import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import '../../styles/produs/Comments.css';
import { format } from 'date-fns';

const ProductComments = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null); // Referință către interval

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/profile/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/produs/comments-list/${productId}`);
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  const startInterval = () => {
    intervalRef.current = setInterval(fetchComments, 5000);
  };

  const stopInterval = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    fetchComments();
    startInterval(); // Pornim intervalul când componenta este montată

    const onFocus = () => {
      startInterval(); // Repornim intervalul când fereastra devine activă
    };

    const onBlur = () => {
      stopInterval(); // Oprim intervalul când fereastra devine inactivă
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      // Curățăm evenimentele la demontare
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
      stopInterval(); // Oprim intervalul când componenta este demontată
    };
  }, [productId]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDetailsData = {};
      for (const comment of comments) {
        if (!userDetails[comment.user_id]) {
          const userInfo = await fetchUserInfo(comment.user_id);
          if (userInfo) {
            userDetailsData[comment.user_id] = {
              firstName: userInfo.first_name || 'Unknown',
              lastName: userInfo.last_name || 'User',
              avatar: userInfo.avatar,
            };
          }
        }
      }
      setUserDetails(prevState => ({ ...prevState, ...userDetailsData }));
    };

    if (comments.length > 0) {
      fetchUserDetails();
    }
  }, [comments]);

  return (
    <div className="comments-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="comments-list">
          {comments.slice().reverse().map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="user-info">
                {userDetails[comment.user_id] && userDetails[comment.user_id].avatar ? (
                  <img
                    src={userDetails[comment.user_id].avatar}
                    alt={`Avatar for ${userDetails[comment.user_id].firstName} ${userDetails[comment.user_id].lastName}`}
                    className="avatar"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="avatar" />
                )}
                <div className="user-details">
                  <p className="user-name">
                    {userDetails[comment.user_id] ? `${userDetails[comment.user_id].firstName} ${userDetails[comment.user_id].lastName}` : 'Unknown User'}
                  </p>
                  <p className="comment-text">{comment.comment}</p>
                </div>
              </div>
              <p className="comment-date">
                {format(new Date(comment.created_at), 'dd.MM.yyyy HH:mm')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductComments;
