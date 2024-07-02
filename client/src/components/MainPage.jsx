import React from 'react';
import bigLogo from './Logos/bigLogo.png'

const MainPage = () => {
  return (
    <section className="main-page">
      <div className="main-content">
        <h1>Implementation in seconds</h1>
        <p>Automatically generate a GraphQL layer over your PostgreSQL database</p>
        <div className="main-buttons">
          <button className="upload-btn">Upload Schema</button>
          <button className="login-btn">Log In</button>
        </div>
      </div>
      <div className="bigLogo">
        <img src={bigLogo} alt="Main Graphic" />
      </div>
    </section>
  );
};

export default MainPage;