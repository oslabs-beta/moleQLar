import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import githubLogo from '../../assets/logos/githubLogo.png';
import linkedInLogo from '../../assets/logos/linkedin.png';
import smallLogo from '../../assets/logos/smallLogo.png'
import { AuthContext } from "../../contexts/AuthContext";
import './navbar.scss';

const Navbar = () => {
  const { isAuth, username, logout } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <Link to="/">
        <div className="logo-container">
          <img src={smallLogo} alt="Small Logo" className="smallLogo" />
          <div className="logo">moleQLar</div>
        </div>
      </Link>
      <ul className="nav-links">
            <li>
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/team">Team</NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
      </ul>
      <div className="social-icons">
        <a href="https://github.com" target="_blank">
          <img src={githubLogo} alt="GitHub" className="githubLogo" />
        </a>
        <a href="https://linkedin.com" target="_blank">
          <img src={linkedInLogo} alt="LinkedIn" className="linkedIn" />
        </a>
      </div>
    </nav>
    
  );
};

export default Navbar;