import React, { useContext, useState } from 'react';
import AuthorizedNavbar from '../AuthorizedNavbar/AuthorizedNavbar';
import ModalGraphName from '../ModalGraphName/ModalGraphName';
import addGraph from '../../assets/logos/addGraph.png';
import { useNavigate } from 'react-router-dom';
import './dashboard.scss';

function Dashboard() {
  const [ modalVisibility, setModalVisibility ] = useState(false);

  const handleModalOpen = (e) => {
    // e.preventDefault();
    setModalVisibility(true);
  }
  const handleModalClose = (e) => {
    // e.preventDefault();
    setModalVisibility(false);
  }

  return (
    <>
      <ModalGraphName modalVisibility={modalVisibility} handleModalClose={handleModalClose}/>
      <AuthorizedNavbar />
      <div className="dashboard">
        <h1>Your Saved Graphs</h1>
        <div className="add-graph-section">
          <button className="add-graph-button" onClick={handleModalOpen}>
            <img src={addGraph} alt="Add Graph" />
          </button>
          <p>Click here to create a new project</p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
