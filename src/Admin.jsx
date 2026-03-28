import React, { useEffect, useState } from "react";

const Admin = ({ goBack }) => {
  const [queues, setQueues] = useState([]);
  const [error, setError] = useState("");

const BASE_URL = "https://sqms-backend.onrender.com/api/queue";
  const fetchQueues = async () => {
    try {
      setError("");
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setQueues(data);
    } catch (err) {
      console.error("Error fetching queues:", err);
      setError("Failed to load queue data");
    }
  };

  const callNext = async () => {
    try {
      setError("");
      const res = await fetch(`${BASE_URL}/call-next`, {
        method: "POST"
      });

      if (res.ok) {
        fetchQueues();
      } else {
        setError("Failed to call next. Queue might be empty.");
      }
    } catch (err) {
      console.error("Error calling next:", err);
      setError("Network error. Please try again.");
    }
  };

  const clearAllQueues = async () => {
    if (!window.confirm("Are you sure you want to clear all active queues? This action cannot be undone.")) {
      return;
    }

    try {
      setError("");
      const res = await fetch(`${BASE_URL}/clear`, {
        method: "POST"
      });

      if (res.ok) {
        fetchQueues();
      } else {
        setError("Failed to clear queues");
      }
    } catch (err) {
      console.error("Error clearing queues:", err);
      setError("Network error. Please try again.");
    }
  };

  const resetSystem = async () => {
    if (!window.confirm("Are you sure you want to reset the entire queue system? This will clear all data and cannot be undone.")) {
      return;
    }

    try {
      setError("");
      const res = await fetch(`${BASE_URL}/reset`, {
        method: "POST"
      });

      if (res.ok) {
        fetchQueues();
      } else {
        setError("Failed to reset system");
      }
    } catch (err) {
      console.error("Error resetting system:", err);
      setError("Network error. Please try again.");
    }
  };

  useEffect(() => {
    fetchQueues();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchQueues, 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingQueues = queues.filter(q => q.status === "WAITING");
  const servingQueues = queues.filter(q => q.status === "SERVING");
  const completedQueues = queues.filter(q => q.status === "COMPLETED");

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      padding: "24px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}>
          <div style={{
            backgroundColor: "#3b82f6",
            padding: "12px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ fontSize: "24px" }}>👥</span>
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "700",
              color: "#1e293b"
            }}>
              Admin Dashboard
            </h1>
            <p style={{
              margin: 0,
              color: "#64748b",
              fontSize: "14px"
            }}>
              Queue Management System
            </p>
          </div>
        </div>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <button
            onClick={fetchQueues}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            <span style={{ fontSize: "16px" }}>🔄</span>
            Refresh
          </button>
          <button
            onClick={goBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            <span style={{ fontSize: "16px" }}>⬅️</span>
            Back
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto 20px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{ color: "#ef4444", fontSize: "20px" }}>⚠️</span>
          <span style={{ color: "#dc2626", fontWeight: "500" }}>{error}</span>
        </div>
      )}

      {/* Key Metrics */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto 24px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px"
      }}>
        {/* Total Patients */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px"
          }}>
            <span style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Total Customers
            </span>
            <span style={{ fontSize: "20px" }}>👥</span>
          </div>
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#1e293b"
          }}>
            {queues.length}
          </div>
          <div style={{
            fontSize: "12px",
            color: "#64748b",
            marginTop: "4px"
          }}>
            All registered customers
          </div>
        </div>

        {/* Waiting */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px"
          }}>
            <span style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Waiting
            </span>
            <span style={{ fontSize: "20px" }}>⏳</span>
          </div>
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#1e293b"
          }}>
            {pendingQueues.length}
          </div>
          <div style={{
            fontSize: "12px",
            color: "#64748b",
            marginTop: "4px"
          }}>
            In queue
          </div>
        </div>

        {/* Being Served */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px"
          }}>
            <span style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Being Served
            </span>
            <span style={{ fontSize: "20px" }}>✅</span>
          </div>
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#1e293b"
          }}>
            {servingQueues.length}
          </div>
          <div style={{
            fontSize: "12px",
            color: "#64748b",
            marginTop: "4px"
          }}>
            Currently being served
          </div>
        </div>

        {/* Completed */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px"
          }}>
            <span style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Completed
            </span>
            <span style={{ fontSize: "20px" }}>✅</span>
          </div>
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#1e293b"
          }}>
            {completedQueues.length}
          </div>
          <div style={{
            fontSize: "12px",
            color: "#64748b",
            marginTop: "4px"
          }}>
            Services completed
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto 24px"
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px"
          }}>
            <h3 style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b"
            }}>
              System Management
            </h3>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "#64748b"
            }}>
              <span style={{ fontSize: "14px" }}>🛡️</span>
              Admin Privileges Required
            </div>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px"
          }}>
            <button 
              onClick={callNext}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 16px",
                backgroundColor: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#16a34a"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#22c55e"}
            >
              <span style={{ fontSize: "16px" }}>▶️</span>
              Call Next Customer
            </button>
            
            <button 
              onClick={clearAllQueues}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 16px",
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#d97706"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#f59e0b"}
            >
              <span style={{ fontSize: "16px" }}>🗑️</span>
              Clear All Queues
            </button>
            
            <button 
              onClick={resetSystem}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 16px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
            >
              <span style={{ fontSize: "16px" }}>🔄</span>
              Reset System
            </button>
          </div>
        </div>
      </div>

      {/* Patient Queue Table */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto 24px"
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          overflow: "hidden"
        }}>
          <div style={{
            padding: "16px 20px",
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <span style={{ fontSize: "20px" }}>📋</span>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                Customer Queue Management
              </h3>
            </div>
            <div style={{
              fontSize: "12px",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ fontSize: "14px" }}>🔄</span>
              Auto-refreshes every 5 seconds
            </div>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Token</th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Customer Name</th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Department</th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {queues.map((q) => (
                  <tr 
                    key={q.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      backgroundColor: q.status === "SERVING" ? "#fffbeb" : "white"
                    }}
                  >
                    <td style={{ padding: "16px" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                      }}>
                        <span style={{ 
                          fontWeight: "700", 
                          fontSize: "18px",
                          fontFamily: "'Courier New', monospace",
                          color: q.status === "SERVING" ? "#d97706" : "#1e293b"
                        }}>
                          {q.tokenNumber}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ 
                        fontWeight: "600", 
                        color: "#1e293b",
                        textTransform: "capitalize"
                      }}>
                        {q.name}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ 
                        fontSize: "14px",
                        color: "#64748b",
                        backgroundColor: "#f1f5f9",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontWeight: "500"
                      }}>
                        {q.service}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        backgroundColor: q.status === "SERVING" ? "#fffbeb" : 
                                       q.status === "COMPLETED" ? "#ecfdf5" : "#f8fafc",
                        color: q.status === "SERVING" ? "#d97706" : 
                              q.status === "COMPLETED" ? "#16a34a" : "#64748b",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}>
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {queues.length === 0 && (
            <div style={{
              padding: "24px",
              textAlign: "center",
              color: "#64748b",
              fontSize: "14px"
            }}>
              No customers in queue
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        textAlign: "center",
        color: "#64748b",
        fontSize: "14px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          marginBottom: "16px",
          flexWrap: "wrap"
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🔄</span>
            Real-time Updates
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>👥</span>
            Customer Service
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>✅</span>
            Service Management
          </span>
        </div>
        <p style={{ margin: 0 }}>
          Providing quality service management with efficient customer handling.
        </p>
      </div>
    </div>
  );
};

export default Admin;
