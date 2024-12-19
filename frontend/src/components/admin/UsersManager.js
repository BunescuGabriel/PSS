import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin/UsersMana.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTimes } from "@fortawesome/free-solid-svg-icons";

function UsersManager() {
  const [users, setUsers] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [userIsSuperUser, setUserIsSuperUser] = useState(false);

  const fetchUserAccess = async () => {
    try {
      const storedAccessToken = sessionStorage.getItem('accessToken'); // Folosirea sessionStorage în loc de localStorage
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
      console.error('Eroare la preluarea accesului utilizatorului:', error);
    }
  };

  useEffect(() => {
    fetchUserAccess();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Eroare la preluarea datelor:', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/profile/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Eroare la preluarea informațiilor despre utilizator:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserNames = async () => {
      const userNamesData = {};
      for (const user of users) {
        const userInfo = await fetchUserInfo(user.id);
        if (userInfo) {
          userNamesData[user.id] = {
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
            avatar: userInfo.avatar,
          };
        } else {
          userNamesData[user.id] = null;
        }
      }
      setUserNames(userNamesData);
    };

    fetchUserNames();
  }, [users]);

  const handleUpdateUser = async (userId, isSuperuser) => {
    if (userIsSuperUser) {
      try {
        await axios.patch(`http://localhost:8000/api/users/${userId}`, { is_superuser: isSuperuser }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`, // Folosirea sessionStorage în loc de localStorage
          },
        });
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, is_superuser: isSuperuser } : user
          )
        );
      } catch (error) {
        console.error('Eroare la actualizarea utilizatorului:', error);
      }
    } else {
      console.error('Permisiune respinsă: Nu sunteți un super utilizator.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userIsSuperUser) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`, // Folosirea sessionStorage în loc de localStorage
          },
        });

        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } catch (error) {
        console.error('Eroare la ștergerea utilizatorului:', error);
      }
    } else {
      console.error('Permisiune respinsă: Nu sunteți un super utilizator.');
    }
  };

  return (
    <div className="users-manager-container">
      <h2 className="users-manager-title">Listă de Utilizatori</h2>
      <ul className="users-list">
        {users.slice().reverse().map((user) => (
          <li key={user.id} className="user-item">
            <span className="user-username">{user.username}</span>
            {userNames[user.id] ? (
              <div className="user-info">
                {userNames[user.id].firstName && userNames[user.id].lastName ? (
                  <span className="user-name">
                    {`${userNames[user.id].firstName} ${userNames[user.id].lastName}`}
                  </span>
                ) : (
                  <span className="user-name">
                    {'Unknown User'}
                  </span>
                )}
                {userNames[user.id].avatar ? (
                  <img
                    src={userNames[user.id].avatar}
                    alt={`Avatar pentru ${userNames[user.id].firstName} ${userNames[user.id].lastName}`}
                    className="avatara"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="avatara" />
                )}
              </div>
            ) : (
              <div className="user-info">
                <span className="user-name">
                  {'Unknown User'}
                </span>
                <FontAwesomeIcon
                  icon={faUser}
                  className="avatara"
                />
              </div>
            )}
            <div className="user-actions">
              {user.is_superuser ? (
                <button
                  onClick={() => handleUpdateUser(user.id, false)}
                  className="user-superuser-button"
                >
                  Dezactivare Superuser
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateUser(user.id, true)}
                  className="user-superuser-button"
                >
                  Activare Superuser
                </button>
              )}
              <FontAwesomeIcon
                icon={faTimes}
                className="deleta-icon"
                onClick={() => handleDeleteUser(user.id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersManager;
