import axios from 'axios';
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import smallLogo from '../../assets/logos/smallLogo.png';
import { useAuth } from '../../contexts/AuthContext.js';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './authorizednavbar.scss';


const AuthorizedNavbar = () => {
  const navigate = useNavigate();
  const { authState, setAuthState } = useAuth();

  const handleLogOut = () => {
    setAuthState({
      isAuth: false,
      username: "",
      user_id: null,
    });
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    return navigate('/');
  }

  const {darkMode, toggleDarkMode} = useTheme()

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <NavLink to="/">
        <div className="logo-container">
          <img src={smallLogo} alt="Small Logo" className="smallLogo" />
          <div className="logo">moleQLar</div>
        </div>
      </NavLink>
      <ul className="nav-links">
        <li>
          <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/" className="nav-link" onClick={handleLogOut}>
            Logout
          </NavLink>
        </li>
        <li>
          <button className="theme-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AuthorizedNavbar;