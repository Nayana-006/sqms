import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Mock authentication - in a real app, this would call your backend
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    // Check localStorage first, then fallback to mock users
    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
    const mockUsers = {
      "admin": { password: "admin123", role: "admin" },
      "staff": { password: "staff123", role: "staff" },
      "customer": { password: "customer123", role: "customer" }
    };

    // Combine stored users with mock users (stored users take precedence)
    const allUsers = { ...mockUsers, ...storedUsers };

    if (allUsers[username] && allUsers[username].password === password) {
      const user = {
        username: username,
        role: allUsers[username].role
      };
      onLogin(user);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ margin: 0, color: "#2c3e50" }}>Queue Management System</h2>
          <p style={{ color: "#7f8c8d", margin: "5px 0 0 0" }}>Please sign in to continue</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#333"
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
              placeholder="Enter your username"
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#333"
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#2980b9"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#3498db"}
          >
            Sign In
          </button>
        </form>

        {/* Demo credentials */}
        <div style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
          border: "1px solid #dee2e6"
        }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#495057" }}>Demo Credentials:</h4>
          <div style={{ fontSize: "12px", color: "#6c757d" }}>
            <div><strong>Admin:</strong> admin / admin123</div>
            <div><strong>Staff:</strong> staff / staff123</div>
            <div><strong>Customer:</strong> customer / customer123</div>
          </div>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ color: "#6c757d", fontSize: "14px" }}>
            Don't have an account?{" "}
            <button
              onClick={() => onLogin({ signup: true })}
              style={{
                background: "none",
                border: "none",
                color: "#3498db",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;