import React, { useContext, useState } from 'react';
import AuthorizedNavbar from '../AuthorizedNavbar/AuthorizedNavbar';
import addGraph from '../../assets/logos/addGraph.png';
import { useNavigate } from 'react-router-dom';
import './dashboard.scss';

function Dashboard() {
  const navigate = useNavigate();

  const navigateToGraph = () =>{
    navigate('/graph')
  }

  return (
    <>
      <AuthorizedNavbar />
      <div className="dashboard">
        <h1>Your Saved Graphs</h1>
        <div className="add-graph-section">
          <button className="add-graph-button" onClick={navigateToGraph}>
            <img src={addGraph} alt="Add Graph" />
          </button>
          <p>Click here to create a new project</p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
