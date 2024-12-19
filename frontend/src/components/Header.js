import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGlobe, faClock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Header.css';
import logo from '../images/logo.jpg';

function Header() {
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    avatar: '',
  });
  const [userIsSuperUser, setUserIsSuperUser] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const accessToken = sessionStorage.getItem('accessToken');
  const menuRef = useRef(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/users-profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 && response.data.length > 0) {
        const user = response.data[0];
        const updatedUserProfile = {
          first_name: user.first_name,
          last_name: user.last_name,
          avatar: user.avatar,
        };

        if (
          userProfile.first_name !== updatedUserProfile.first_name ||
          userProfile.last_name !== updatedUserProfile.last_name ||
          userProfile.avatar !== updatedUserProfile.avatar
        ) {
          setUserProfile(updatedUserProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserAccess = async () => {
    try {
      const storedAccessToken = sessionStorage.getItem('accessToken');
      if (storedAccessToken) {
        const response = await axios.get('http://127.0.0.1:8000/api/users/users-profile', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedAccessToken}`,
          },
        });
        if (response.status === 200 && response.data.length > 0) {
          const user = response.data[0];
          if (user.user && user.user.email) {
            const userEmail = user.user.email;
            const userResponse = await axios.get(`http://127.0.0.1:8000/api/users/get-user-id-by-email/${userEmail}/`);
            setUserIsSuperUser(userResponse.data.is_superuser > 0);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user access:', error);
    }
  };

  const toggleMenu = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    fetchUserAccess();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchUserData();
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const scrollThreshold = 210; // Pragul de scrolare pentru a considera că utilizatorul a trecut de antet
      setIsScrolled(offset > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <a href="/"><img src={logo} alt="Home" className="logo-img" /></a>
      <nav className="navigation-bar">
        <ul>
          <li><a href="/about">DESPRE NOI</a></li>
          <li><a href="/conditii">TERMENI ȘI CONDIȚII</a></li>
          {userIsSuperUser && <li><a href="/admin">Administrator</a></li>}
        </ul>
      </nav>

      <div className={"LOCAL-TIMING"}>
        <span className="icon-globe"> &#127758;</span>
        <li className="horizontal-list">
          <ul>
            <li className={"abcc"}>Bălți</li>
            <li className={"abc"}>Moldova</li>
          </ul>
        </li>
      </div>

      <div className={"LOCAL-TIMING"}>
        <FontAwesomeIcon icon={faClock} className="icon-globee" />
        <li className="horizontal-list">
          <ul>
            <li className={"abcc"}>Luni - Duminică</li>
            <li className={"abc"}>24/24</li>
          </ul>
        </li>
      </div>

      <div className="user-menu">
        {accessToken ? (
          <div className="avatar-circle" onClick={toggleMenu} ref={menuRef}>
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt="Avatar" className="avatar" key={userProfile.avatar} />
            ) : (
              <FontAwesomeIcon icon={faUser} className="icon" />
            )}
            {isDropdownOpen && (
              <ul className="menu">
                <li className="user-name">{userProfile.first_name} {userProfile.last_name}</li>
                {/*<li><Link to="/profile">Profile</Link></li>*/}
                {/*<li><Link to="/logout">Logout</Link></li>*/}
                <li><Link to="/profile" className="button-hed">Cabinetul personal</Link></li>
                <li><Link to="/logout" className="button-hed">Deconectare</Link></li>
              </ul>
            )}
          </div>
        ) : (
          <div className="avatar-circle" onClick={toggleMenu} ref={menuRef}>
            <FontAwesomeIcon icon={faUser} className="icon" />
            {isDropdownOpen && (
              <ul className="menu">
                {/*<li><Link to="/login">Login</Link></li>*/}
                {/*<li><Link to="/register">Register</Link></li>*/}
                <li><Link to="/login" className="button-hed">Autentificare</Link></li>
                <li><Link to="/register" className="button-hed">Înregistrare</Link></li>
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
