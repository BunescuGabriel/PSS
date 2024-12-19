import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/profile/Profiles.css';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phoneNumber: '',
    birthday: '',
    gender: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phoneNumber: '',
    birthday: '',
    gender: '',
    avatar: '',
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleOpenEditForm = () => {
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem("accessToken");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setAvatarFile(file);
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedData = { ...formData };
      const updatedFormData = new FormData();

      for (const key in updatedData) {
        if (updatedData[key] !== '') {
          updatedFormData.append(key, updatedData[key]);
        }
      }

      if (avatarFile) {
        updatedFormData.append('avatar', avatarFile);
      }

      const response = await axios.patch(
        'http://localhost:8000/api/users/users-profile',
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        loadData();
        setShowEditForm(false);
      } else {
        // Tratați cazurile de eroare aici
      }
    } catch (error) {
      // Tratați erorile aici
    }
  };

  const loadData = async () => {
    try {
      const storedAccessToken = sessionStorage.getItem("accessToken");

      if (storedAccessToken) {
        const userProfileResponse = await axios.get('http://localhost:8000/api/users/users-profile', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedAccessToken}`,
          },
        });
        if (userProfileResponse.status === 200 && userProfileResponse.data.length > 0) {
          const user = userProfileResponse.data[0];
          setUserProfile({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.user.email,
            phoneNumber: user.phoneNumber,
            birthday: user.birthday,
            gender: user.gender,
            avatar: user.avatar,
          });
          setLoading(false);
        } else {
          console.error('Error loading data:', userProfileResponse);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [navigate, accessToken]);

  return (
    <div>
      <div className="profile-container">
        <div className="settings-panel">
          <h1>
            Setări
            <FontAwesomeIcon icon={faCog} className="settings-icon" />
          </h1>
          <button className="settings-button" onClick={handleChangePassword}>
            Schimbaţi parola
          </button>
        </div>
        <div className="profile-info">
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : (
            <div className="column-profile">
              <div className="column-container">
                <div className="column-left">
                  <h2 className="section-title">Informații personale</h2>
                  <p className="info-label">Nume: {userProfile.first_name} {userProfile.last_name}</p>
                  <p className="info-label">Email: {userProfile.email}</p>
                  <p className="info-label">Număr de telefon: {userProfile.phoneNumber}</p>
                  <p className="info-label">Data nașterii: {userProfile.birthday}</p>
                  <p className="info-label">Gen: {userProfile.gender === 0 ? 'Male' : userProfile.gender === 1 ? 'Female' : 'Unspecified'}</p>
                  <button className="edit-button" onClick={handleOpenEditForm}>Editare</button>
                </div>
                <div className="column-right">
                  <div className="avatarr-container">
                    <img src={userProfile.avatar} alt="Avatar" className="avatarr" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditForm && (
        <div className="modall">
          <div className="modal-contentt">
            <h2 className="editt-title">Editează profilul:</h2>
            <form>
              <label htmlFor="first_name" className="form-label">Nume:</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Nume"
                className="form-input"
              />
              <label htmlFor="last_name" className="form-label">Prenume:</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Prenume"
                className="form-input"
              />
              <label htmlFor="phoneNumber" className="form-label">Număr de telefon:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Număr de telefon"
                className="form-input"
              />
              <label htmlFor="birthday" className="form-label">Zi de nastere:</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                placeholder="Zi de nastere"
                className="form-input"
              />
              <label htmlFor="gender" className="form-label">Gen:</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
              >
                <option value="2">Nu este specificat</option>
                <option value="0">Masculin</option>
                <option value="1">Femeie</option>
              </select>
              <Dropzone onDrop={handleImageUpload}>
                {({ getRootProps, getInputProps }) => (
                  <div className="avatar-upload-container" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <img src={userProfile.avatar} alt="Avatar" className="avatar" />
                    <p className="avatar-upload-text">Faceți clic aici pentru a încărca un nou avatar</p>
                  </div>
                )}
              </Dropzone>
              <button type="button" className="update-button-profile" onClick={handleUpdateProfile}>
                Actualizare profil
              </button>
              <button type="button" className="close-button-profile" onClick={handleCloseEditForm}>
                Închide
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
