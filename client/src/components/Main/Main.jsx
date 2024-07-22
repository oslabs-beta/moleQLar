import React from 'react';
import heroImg from '../../assets/logos/hero-img.png'
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import './main.scss';
// Main Component to construct 
const Main = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar/>
      <div className="container">
        {/* <section className="main-page"> */}
          <section className="hero-section">
            <div className="hero-content">
              <h1>Implementation<br /> in seconds</h1>
              <p>Automatically generate a GraphQL layer over your PostgreSQL database</p>
              <div className="main-btns-container">
                <button className="btn-login btn-home" onClick={() => navigate("/login")}>Log In</button>
                <button className="btn-signup btn-home" onClick={() => navigate("/signup")}>Sign Up</button>
              </div>
            </div>
            <div className="hero-img-container">
              <img src={heroImg} className="hero-img" alt="molecule image" />
            </div>
          </section>
        {/* </section> */}
      </div>
    </>
  );
};

export default Main;