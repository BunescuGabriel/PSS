import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../styles/produs/Comments.css';
import { format } from 'date-fns';

const DeleteComments = ({ productId }) => {
  const [comments, setComments] = useState([]);
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

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/produs/comments-list/${productId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchUserAccess();
  }, [productId]);

  useEffect(() => {
    const fetchUserNames = async () => {
      const userNamesData = {};
      for (const comment of comments) {
        const userInfo = await fetchUserInfo(comment.user_id);
        if (userInfo) {
          userNamesData[comment.user_id] = {
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
            avatar: userInfo.avatar,
          };
        }
      }
      setUserNames(userNamesData);
    };

    if (comments.length > 0) {
      fetchUserNames();
    }
  }, [comments]);

  const handleDeleteComment = (commentId) => {
  if (userIsSuperUser) {
    axios
      .delete(`http://localhost:8000/api/produs/car/${productId}/comments/${commentId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      .then(() => {
        fetchComments();
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
      });
  } else {
    console.error('Permission denied: You are not a super user.');
  }
};


  return (
    <div className="comments-container">
      <ul className="comments-list">
          {comments.slice().reverse().map((comment) => (
          <li key={comment.id} className="comment-item">
            <div className="user-info">
              {userNames[comment.user_id] ? (
                <img
                  src={userNames[comment.user_id].avatar}
                  alt={`Avatar for ${userNames[comment.user_id].firstName} ${userNames[comment.user_id].lastName}`}
                  className="avatar"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className="avatar" />
              )}
              <div className="user-details">
                <p className="user-name">
                  {userNames[comment.user_id]
                    ? `${userNames[comment.user_id].firstName} ${userNames[comment.user_id].lastName}`
                    : 'Unknown User'}
                </p>
                <p className="comment-text">{comment.comment}</p>
              </div>
            </div>
            <p className="comment-date">
              {format(new Date(comment.created_at), 'dd.MM.yyyy HH:mm')}
            </p>
            <FontAwesomeIcon
              icon={faTimes}
              className="deletee-icon"
              onClick={() => handleDeleteComment(comment.id)} // Folosiți comment.id pentru ștergere
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeleteComments;
