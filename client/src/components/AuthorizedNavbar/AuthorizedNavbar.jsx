import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import smallLogo from '../../assets/logos/smallLogo.png';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './authorizednavbar.scss';


const AuthorizedNavbar = () => {
  const { isAuth, username, logout } = useContext(AuthContext);
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
          <NavLink to="/" className="nav-link" onClick={logout}>
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