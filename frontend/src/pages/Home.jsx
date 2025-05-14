import React from 'react';
import './Home.css'; // We'll use this for custom CSS
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="glass-card">
        <h1 className="home-title">AI-Driven Cyber Threat Response</h1>
        <p className="home-subtitle">
          Detect, analyze, and respond to cyber threats in real-time using intelligent automation.
        </p>
        <button className="btn btn-primary get-started-btn" onClick={() => navigate('/dashboard')}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
