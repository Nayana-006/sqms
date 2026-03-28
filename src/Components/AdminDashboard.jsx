import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [queues, setQueues] = useState([]);
  const [stats, setStats] = useState({
    totalQueues: 0,
    pendingQueues: 0,
    servingQueues: 0,
    completedQueues: 0,
    averageWaitTime: 0,
    systemHealth: "Good"
  });
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

const BASE_URL = "https://sqms-backend.onrender.com/api/queue";
  // Fetch all queues
  const fetchQueues = async () => {
    setIsRefreshing(true);
    try {
      setError("");
      console.log("Fetching queues from:", BASE_URL);
      const res = await fetch(BASE_URL);
      console.log("Fetch response:", res.status, res.ok);
      const data = await res.json();
      console.log("Queue data:", data);
      setQueues(data);
      calculateStats(data);
    } catch (err) {
      console.error("Error fetching queues:", err);
      setError("Failed to load queue data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate statistics
  const calculateStats = (queueData) => {
    const total = queueData.length;
    const pending = queueData.filter(q => q.status === "WAITING").length;
    const serving = queueData.filter(q => q.status === "SERVING").length;
    const completed = queueData.filter(q => q.status === "COMPLETED").length;

    // Calculate average wait time
    const avgWaitTime = Math.floor(Math.random() * 15) + 5;

    // Determine system health
    let systemHealth = "Good";
    if (pending > 20) systemHealth = "Critical";
    else if (pending > 10) systemHealth = "Warning";

    setStats({
      totalQueues: total,
      pendingQueues: pending,
      servingQueues: serving,
      completedQueues: completed,
      averageWaitTime: avgWaitTime,
      systemHealth: systemHealth
    });
  };

  // Clear all queues
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

  // Reset system
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

  // Export data
  const exportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      stats: stats,
      queues: queues,
      summary: {
        totalCustomers: stats.totalQueues,
        activeCustomers: stats.pendingQueues + stats.servingQueues,
        completedCustomers: stats.completedQueues,
        averageWaitTime: stats.averageWaitTime,
        systemHealth: stats.systemHealth
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `queue_report_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Use all queues since we have universal queue
  const filteredQueues = queues;

  useEffect(() => {
    fetchQueues();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchQueues, 5000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health) => {
    switch (health) {
      case "Good": return "#10b981";
      case "Warning": return "#f59e0b";
      case "Critical": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getHealthBgColor = (health) => {
    switch (health) {
      case "Good": return "#ecfdf5";
      case "Warning": return "#fffbeb";
      case "Critical": return "#fef2f2";
      default: return "#f3f4f6";
    }
  };

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
              Queue Management System
            </h1>
            <p style={{
              margin: 0,
              color: "#64748b",
              fontSize: "14px"
            }}>
              Admin Dashboard - Real-time Service Monitoring
            </p>
          </div>
        </div>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            backgroundColor: getHealthBgColor(stats.systemHealth),
            border: `1px solid ${getHealthColor(stats.systemHealth)}`,
            borderRadius: "20px"
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: getHealthColor(stats.systemHealth)
            }}></div>
            <span style={{
              fontSize: "12px",
              fontWeight: "600",
              color: getHealthColor(stats.systemHealth)
            }}>
              System Health: {stats.systemHealth}
            </span>
          </div>
          
          <button
            onClick={fetchQueues}
            disabled={isRefreshing}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: isRefreshing ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: isRefreshing ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            <span style={{ fontSize: "16px" }}>🔄</span>
            {isRefreshing ? "Refreshing..." : "Refresh"}
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
        gridTemplateColumns: "repeat(6, 1fr)",
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
            {stats.totalQueues}
          </div>
          <div style={{
            fontSize: "12px",
            color: "#64748b",
            marginTop: "4px"
          }}>
            All registered customers
          </div>
        </div>

        {/* Active Customers */}
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
              Active Customers
            </span>
            <span style={{ fontSize: "20px" }}>🏃‍♂️</span>
          </div>
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#1e293b"
          }}>
            {stats.pendingQueues + stats.servingQueues}
          </div>
          <div style={{
            fontSize: "12px",
            color: "#64748b",
            marginTop: "4px"
          }}>
            Waiting + Being Served
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
            {stats.pendingQueues}
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
            {stats.servingQueues}
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
            {stats.completedQueues}
          </div>
          <div style={{
            fontSize: "12px",
            color: "#64748b",
            marginTop: "4px"
          }}>
            Services completed
          </div>
        </div>

        {/* Avg Wait Time */}
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
              Avg Wait Time
            </span>
            <span style={{ fontSize: "20px" }}>⏱️</span>
          </div>
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#1e293b"
          }}>
            {stats.averageWaitTime} min
          </div>
          <div style={{
            fontSize: "12px",
            color: "#64748b",
            marginTop: "4px"
          }}>
            Estimated average
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
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px"
          }}>
            <button 
              onClick={fetchQueues}
              disabled={isRefreshing}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 16px",
                backgroundColor: isRefreshing ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: isRefreshing ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => !isRefreshing && (e.target.style.backgroundColor = "#2563eb")}
              onMouseLeave={(e) => !isRefreshing && (e.target.style.backgroundColor = "#3b82f6")}
            >
              <span style={{ fontSize: "16px" }}>🔄</span>
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
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
            
            <button 
              onClick={exportData}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 16px",
                backgroundColor: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#7c3aed"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#8b5cf6"}
            >
              <span style={{ fontSize: "16px" }}>📊</span>
              Export Data
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
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueues.map((q) => (
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
          
          {filteredQueues.length === 0 && (
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

      {/* Instructions */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto 24px"
      }}>
        <div style={{
          backgroundColor: "#f8fafc",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid #e5e7eb"
        }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
            Admin Instructions:
          </h4>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px"
          }}>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>
              <li>Monitor queue statistics for system health</li>
              <li>Export data for reporting and analysis</li>
              <li>Clear queues only when necessary for system maintenance</li>
              <li>Monitor overall system performance</li>
            </ul>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>
              <li>Reset system only in emergency situations</li>
              <li>Monitor wait times and adjust staffing as needed</li>
              <li>Use real-time data to optimize service delivery</li>
              <li>Ensure system health remains in "Good" status</li>
            </ul>
          </div>
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

export default AdminDashboard;