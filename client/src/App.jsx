import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage.jsx';
import Navbar from './components/NavBar.jsx';
import Team from './components/TeamPage.jsx';
import About from './components/About.jsx';
import './components/Styles/styles.css';
import './components/Styles/team.css';
import './components/Styles/about.css';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/team" element={<Team />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
};

export default App;
