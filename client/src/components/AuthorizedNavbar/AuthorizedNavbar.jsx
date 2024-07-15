import axios from 'axios';
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import smallLogo from '../../assets/logos/smallLogo.png';
import { useAuth } from '../../contexts/AuthContext.js';
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

  return (
    <nav className="navbar">
      <NavLink to="/">
        <div className="logo-container">
          <img src={smallLogo} alt="Small Logo" className="smallLogo" />
          <div className="logo">moleQLar</div>
        </div>
      </NavLink >
      <ul className="nav-links">
        <li>
          <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/" className="nav-link" onClick={handleLogOut}>
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AuthorizedNavbar;