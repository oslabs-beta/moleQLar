import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import smallLogo from '../../assets/logos/smallLogo.png';
import { AuthContext } from '../../contexts/AuthContext';
import '../../assets/styles/LoggedinNav.scss';

const LoggedinNavbar = () => {
  const { isAuth, username, logout } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={smallLogo} alt="Small Logo" className="smallLogo" />
        <div className="logo">moleQLar</div>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/" onClick={logout}>
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default LoggedinNavbar;