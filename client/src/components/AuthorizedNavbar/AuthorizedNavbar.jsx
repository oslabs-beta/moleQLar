import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import smallLogo from '../../assets/logos/smallLogo.png';
import { AuthContext } from '../../contexts/AuthContext';
import './authorizednavbar.scss';

const AuthorizedNavbar = () => {
  const { isAuth, username, logout } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <Link to="/">
        <div className="logo-container">
          <img src={smallLogo} alt="Small Logo" className="smallLogo" />
          <div className="logo">moleQLar</div>
        </div>
      </Link >
      <ul className="nav-links">
        <li>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </li>
        <li>
          <Link to="/" className="nav-link" onClick={logout}>
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AuthorizedNavbar;