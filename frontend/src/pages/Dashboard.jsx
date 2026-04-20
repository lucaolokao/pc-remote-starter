import React, { useState, useEffect } from 'react';
import './Dashboard.css';

export default function Dashboard({ token, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('offline');
  const [lastCommand, setLastCommand] = useState(null);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStatus(data.esp32_online ? 'online' : 'offline');
      }
    } catch (err) {
      console.error('Status check failed:', err);
    }
  };

  const handleTurnOn = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/turn-on', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setLastCommand(new Date().toLocaleTimeString());
        alert('PC turned on!');
      }
    } catch (err) {
      alert('Failed to turn on PC');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>PC Remote Control</h1>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
      <div className="status">
        <p>Status: <span className={status}>{status.toUpperCase()}</span></p>
      </div>
      <button 
        className="turn-on-btn" 
        onClick={handleTurnOn}
        disabled={loading || status === 'offline'}
      >
        {loading ? 'Sending...' : 'TURN ON PC'}
      </button>
      {lastCommand && <p>Last command: {lastCommand}</p>}
    </div>
  );
}