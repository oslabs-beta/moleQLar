import React from 'react';
import jonathanImg from '../../assets/team-pics/Jonathan.png';
import mingzhuImg from '../../assets/team-pics/Mingzhu.png';
import ericImg from '../../assets/team-pics/Erick.png';
import brianImg from '../../assets/team-pics/Brian.png';
import danImg from '../../assets/team-pics/Dan.png';
import githubLogo from '../../assets/logos/githubLogo.png';
import linkedInLogo from '../../assets/logos/linkedin.png';

import Navbar from '../Navbar/Navbar';

const Team = () => {
  return (
    <>
    <Navbar />
    <section className="team-section">
      <h2>Meet the team</h2>
      <div className="team-grid">
        <div className="team-member">
          <img src={jonathanImg} alt="Jonathan Ghebrial" />
          <h3>Jonathan Ghebrial</h3>
          <p>Software Engineer</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/jonathan-ghebrial/">
              <img src={linkedInLogo} alt="LinkedIn" className="social-logo" />
            </a>
            <a href="https://github.com/jonathan-github">
              <img src={githubLogo} alt="GitHub" className="social-logo" />
            </a>
          </div>
        </div>
        <div className="team-member">
          <img src={mingzhuImg} alt="Mingzhu Wan" />
          <h3>Mingzhu Wan</h3>
          <p>Software Engineer</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/mingzhuwan/">
              <img src={linkedInLogo} alt="LinkedIn" className="social-logo" />
            </a>
            <a href="https://github.com/Mingzhu666">
              <img src={githubLogo} alt="GitHub" className="social-logo" />
            </a>
          </div>
        </div>
        <div className="team-member">
          <img src={ericImg} alt="Eric Alvarez" />
          <h3>Eric Alvarez</h3>
          <p>Software Engineer</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/erick505alvarez/">
              <img src={linkedInLogo} alt="LinkedIn" className="social-logo" />
            </a>
            <a href="https://github.com/seekay505">
              <img src={githubLogo} alt="GitHub" className="social-logo" />
            </a>
          </div>
        </div>
        <div className="team-member">
          <img src={brianImg} alt="Brian Yang" />
          <h3>Brian Yang</h3>
          <p>Software Engineer</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/brian-linkedin">
              <img src={linkedInLogo} alt="LinkedIn" className="social-logo" />
            </a>
            <a href="https://github.com/jibriyang91">
              <img src={githubLogo} alt="GitHub" className="social-logo" />
            </a>
          </div>
        </div>
        <div className="team-member">
          <img src={danImg} alt="Dan Hudgens" />
          <h3>Dan Hudgens</h3>
          <p>Software Engineer</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/dan-linkedin">
              <img src={linkedInLogo} alt="LinkedIn" className="social-logo" />
            </a>
            <a href="https://github.com/DanHudgens">
              <img src={githubLogo} alt="GitHub" className="social-logo" />
            </a>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Team;