import React from 'react';
import { Link } from 'react-router-dom';
import githubLogo from './Logos/githubLogo.png';
import linkedInLogo from './Logos/linkedin.png';
import smallLogo from './Logos/smallLogo.png'

const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="logo-container">
          <img src={smallLogo} alt="Small Logo" className="smallLogo" />
          <div className="logo">moleQLar</div>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/team">Team</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
        <div className="social-icons">
          <a href="https://github.com">
            <img src={githubLogo} alt="GitHub" className="githubLogo" />
          </a>
          <a href="https://linkedin.com">
            <img src={linkedInLogo} alt="LinkedIn" className="linkedIn" />
          </a>
        </div>
      </nav>
    );
  };
  
  export default Navbar;