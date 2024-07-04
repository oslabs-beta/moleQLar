import React from 'react';
import bigLogo from '../../assets/logos/bigLogo.png'
import Navbar from '../Navbar/NavBar';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <>
       <Navbar/> 
      <section className="main-page">
        <div className="main-content">
          <h1>Implementation in seconds</h1>
          <p>Automatically generate a GraphQL layer over your PostgreSQL database</p>
          <div className="main-buttons">
            <button className="upload-btn" onClick={() => navigate("/signup")}>Sign Up</button>
            <button className="login-btn" onClick={() => navigate("/login")}>Log In</button>
          </div>
        </div>
        <div className="bigLogo">
          <img src={bigLogo} alt="Main Graphic" />
        </div>
      </section>
    </>
  );
};

export default MainPage;