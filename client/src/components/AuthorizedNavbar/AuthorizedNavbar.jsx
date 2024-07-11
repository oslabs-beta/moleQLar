import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import smallLogo from '../../assets/logos/smallLogo.png';
import { AuthContext } from '../../contexts/AuthContext';
import './authorizednavbar.scss';

const AuthorizedNavbar = () => {
  const { isAuth, username, logout } = useContext(AuthContext);
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
          <NavLink to="/" className="nav-link" onClick={logout}>
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AuthorizedNavbar;