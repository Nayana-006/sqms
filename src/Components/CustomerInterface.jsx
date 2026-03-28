import React, { useState, useEffect } from "react";
import './CustomerInterface.css';

const CustomerInterface = () => {
  const [name, setName] = useState("");
  const [currentQueue, setCurrentQueue] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const BASE_URL = "https://sqms-backend.onrender.com/api/queue";
  // Join queue
  const joinQueue = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/add?name=${encodeURIComponent(name.trim())}&service=General Service`, {
        method: "POST"
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentQueue(data);
        setName("");
      } else {
        const errorText = await res.text();
        setError(`Failed to join queue. Status: ${res.status} - ${errorText}`);
      }
    } catch (err) {
      console.error("Error joining queue:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form to take another token
  const resetForm = () => {
    setCurrentQueue(null);
    setError("");
  };

  // Auto-refresh current queue status every 3 seconds if user has a token
  useEffect(() => {
    if (currentQueue) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`${BASE_URL}/${currentQueue.id}`);
          if (res.ok) {
            const data = await res.json();
            setCurrentQueue(data);
          }
        } catch (err) {
          console.error("Error checking status:", err);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [currentQueue]);

  return (
    <div className="customer-interface">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>Smart Queue Management</h1>
          <p>Welcome to Customer Service</p>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Join Queue Form */}
          {!currentQueue && (
            <div className="card">
              <h2>Join Queue</h2>
              <div className="form-group">
                <label htmlFor="customerName">Customer Name</label>
                <input
                  id="customerName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="input-field"
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button 
                onClick={joinQueue}
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? "Processing..." : "Join Queue"}
              </button>
            </div>
          )}

          {/* Token Confirmation Screen */}
          {currentQueue && (
            <div className="card token-card">
              <div className="token-header">
                <h2>Token Confirmed</h2>
                <span className="token-number">#{currentQueue.tokenNumber}</span>
              </div>
              <div className="token-details">
                <p><strong>Name:</strong> {currentQueue.name}</p>
                <p className="wait-message">Please wait until your token is called.</p>
              </div>
              <div className="people-ahead">
                <strong>People ahead of you:</strong> {currentQueue.tokenNumber - 1}
              </div>
              <button onClick={resetForm} className="btn-secondary">
                Take Another Token
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerInterface;