import React, { useState } from "react";
import { 
  Users, 
  Shield, 
  LogOut, 
  Calendar, 
  Building2,
  User
} from 'lucide-react';
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import AdminDashboard from "./Components/AdminDashboard";
import StaffInterface from "./Components/StaffInterface";
import CustomerInterface from "./Components/CustomerInterface";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = (userData) => {
    if (userData && userData.signup) {
      setShowSignup(true);
    } else {
      setUser(userData);
      setShowSignup(false);
    }
  };

  const handleSignup = (isSignup) => {
    setShowSignup(isSignup);
  };

  const handleLogout = () => {
    setUser(null);
    setShowSignup(false);
  };

  // Render signup screen
  if (showSignup) {
    return <Signup onSignup={handleSignup} />;
  }

  // Render login screen if no user is logged in
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Render appropriate interface based on user role
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Navigation Header */}
      <nav style={{
        backgroundColor: "white",
        color: "#1e293b",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            backgroundColor: "#3b82f6",
            padding: "10px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Building2 size={24} color="white" />
          </div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: "20px", 
              fontWeight: "700",
              letterSpacing: "-0.5px"
            }}>
              Smart Queue Management
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: "12px", 
              color: "#64748b",
              fontWeight: "500"
            }}>
              Efficient Service Management System
            </p>
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Role Badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: user.role === "admin" ? "#fef3c7" : 
                           user.role === "staff" ? "#dbeafe" : "#f0fdf4",
            padding: "8px 16px",
            borderRadius: "20px",
            border: `1px solid ${user.role === "admin" ? "#f59e0b" : 
                           user.role === "staff" ? "#3b82f6" : "#10b981"}`
          }}>
            {user.role === "admin" && <Shield size={16} color="#d97706" />}
            {user.role === "staff" && <Users size={16} color="#2563eb" />}
            {user.role === "customer" && <User size={16} color="#059669" />}
            <span style={{ 
              fontSize: "12px", 
              fontWeight: "600",
              color: user.role === "admin" ? "#92400e" : 
                     user.role === "staff" ? "#1d4ed8" : "#065f46",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              {user.role === "admin" ? "Administrator" : 
               user.role === "staff" ? "Staff Member" : "Customer"}
            </span>
          </div>

          {/* User Info */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "#f8fafc",
            padding: "8px 16px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb"
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: user.role === "admin" ? "#fef3c7" : 
                             user.role === "staff" ? "#dbeafe" : "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${user.role === "admin" ? "#f59e0b" : 
                             user.role === "staff" ? "#3b82f6" : "#10b981"}`
            }}>
              {user.role === "admin" && <Shield size={16} color="#d97706" />}
              {user.role === "staff" && <Users size={16} color="#2563eb" />}
              {user.role === "customer" && <User size={16} color="#059669" />}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                {user.username}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                {user.role === "admin" ? "System Administrator" : 
                 user.role === "staff" ? "Service Staff" : "Registered User"}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {user.role === "admin" && <AdminDashboard />}
        {user.role === "staff" && <StaffInterface />}
        {user.role === "customer" && <CustomerInterface />}
      </main>
    </div>
  );
}

export default App;