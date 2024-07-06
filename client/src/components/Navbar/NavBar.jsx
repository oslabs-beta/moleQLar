import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import githubLogo from '../../assets/logos/githubLogo.png';
import linkedInLogo from '../../assets/logos/linkedin.png';
import smallLogo from '../../assets/logos/smallLogo.png'
import { AuthContext } from "../../contexts/AuthContext";
import './navbar.scss';

const Navbar = () => {
  const { isAuth, username, logout } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={smallLogo} alt="Small Logo" className="smallLogo" />
        <div className="logo">moleQLar</div>
      </div>
      <ul className="nav-links">
        {
          !isAuth && (
            <>
              <li>
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              <li>
                <Link className="nav-link" to="/team">Team</Link>
              </li>
              <li>
                <Link className="nav-link" to="/about">About</Link>
              </li>
            </>
          )
        }
       
        {
          isAuth && (
            <>
              <li>
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link className="nav-link" to="" onClick={logout}>
                  Logout
                </Link>
              </li>
            </>
          )
        }
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