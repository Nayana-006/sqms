import React, { useEffect, useState } from "react";

const StaffInterface = () => {
  const [queues, setQueues] = useState([]);
  const [currentToken, setCurrentToken] = useState("");
  const [error, setError] = useState("");
  const [isCalling, setIsCalling] = useState(false);

  const BASE_URL = "http://localhost:8080/api/queue";

  // Fetch all queues
  const fetchQueues = async () => {
    try {
      setError("");
      console.log("Fetching queues from:", BASE_URL);
      const res = await fetch(BASE_URL);
      console.log("Fetch response:", res.status, res.ok);
      const data = await res.json();
      console.log("Queue data:", data);
      setQueues(data);
    } catch (err) {
      console.error("Error fetching queues:", err);
      setError("Failed to load queue data");
    }
  };

  // Call next queue
  const callNext = async () => {
    setIsCalling(true);
    try {
      setError("");
      const res = await fetch(`${BASE_URL}/call-next`, {
        method: "POST"
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentToken(data.tokenNumber);
        fetchQueues();
      } else {
        setError("Failed to call next. Queue might be empty.");
      }
    } catch (err) {
      console.error("Error calling next:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsCalling(false);
    }
  };

  // Complete queue
  const completeQueue = async (id) => {
    try {
      setError("");
      const res = await fetch(`${BASE_URL}/complete/${id}`, {
        method: "POST"
      });

      if (res.ok) {
        fetchQueues();
      } else {
        setError("Failed to complete queue");
      }
    } catch (err) {
      console.error("Error completing queue:", err);
      setError("Network error. Please try again.");
    }
  };

  // Skip queue (move to end)
  const skipQueue = async (id) => {
    try {
      setError("");
      const res = await fetch(`${BASE_URL}/skip/${id}`, {
        method: "POST"
      });

      if (res.ok) {
        fetchQueues();
      } else {
        setError("Failed to skip queue");
      }
    } catch (err) {
      console.error("Error skipping queue:", err);
      setError("Network error. Please try again.");
    }
  };

  useEffect(() => {
    fetchQueues();
    
    // Auto-refresh every 3 seconds
    const interval = setInterval(fetchQueues, 3000);
    return () => clearInterval(interval);
  }, []);

  const pendingQueues = queues.filter(q => q.status === "WAITING");
  const servingQueues = queues.filter(q => q.status === "SERVING");
  const completedQueues = queues.filter(q => q.status === "COMPLETED");

  // Filter queues - now just use all queues since we have universal queue
  const filteredQueues = queues;

  const getStepTitle = (currentStep) => {
    switch (currentStep) {
      case "start": return "Start Shift";
      case "check_queue": return "Check Queue";
      case "call_customer": return "Call Customer";
      case "serve_customer": return "Serve Customer";
      case "complete_service": return "Complete Service";
      case "next_customer": return "Next Customer";
      default: return "Service";
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
            backgroundColor: "#22c55e",
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
              Staff Queue Management
            </h1>
            <p style={{
              margin: 0,
              color: "#64748b",
              fontSize: "14px"
            }}>
              Service Management Dashboard
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

      {/* Current Token Display */}
      {currentToken && (
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto 24px",
          backgroundColor: "#fffbeb",
          border: "2px solid #f59e0b",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "8px"
          }}>
            <div style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#f59e0b",
              animation: "pulse 2s infinite"
            }}></div>
            <h2 style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "700",
              color: "#92400e"
            }}>
              Current Customer
            </h2>
          </div>
          <div style={{
            fontSize: "32px",
            fontWeight: "800",
            fontFamily: "'Courier New', monospace",
            color: "#92400e",
            letterSpacing: "2px"
          }}>
            {currentToken}
          </div>
          <p style={{
            margin: "8px 0 0 0",
            color: "#92400e",
            fontSize: "14px",
            fontWeight: "600"
          }}>
            Please attend to this customer
          </p>
        </div>
      )}

      {/* Step Progress Indicator */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto 30px"
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb"
        }}>
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
              Service Process
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#64748b" }}>
              Staff service workflow management
            </p>
          </div>
          
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px"
          }}>
            {["start", "check_queue", "call_customer", "serve_customer", "complete_service", "next_customer"].map((processStep, index) => (
              <div key={processStep} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                position: "relative"
              }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#e5e7eb",
                  color: "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  fontSize: "14px",
                  marginBottom: "8px",
                  border: "2px solid #e5e7eb"
                }}>
                  {index + 1}
                </div>
                <div style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#64748b",
                  textAlign: "center",
                  maxWidth: "80px"
                }}>
                  {getStepTitle(processStep)}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#e5e7eb",
            borderRadius: "4px",
            overflow: "hidden"
          }}>
            <div style={{
              width: "0%",
              height: "100%",
              backgroundColor: "#3b82f6",
              transition: "width 0.3s ease"
            }}></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
              Customer Management
            </h3>
            <div style={{
              fontSize: "12px",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ fontSize: "14px" }}>🔄</span>
              Active Queue Management
            </div>
          </div>
          
          <div style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}>
            <button 
              onClick={callNext}
              disabled={isCalling}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                flex: 1,
                minWidth: "200px",
                padding: "14px 20px",
                backgroundColor: isCalling ? "#9ca3af" : "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: isCalling ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "700",
                transition: "all 0.2s",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              onMouseEnter={(e) => !isCalling && (e.target.style.backgroundColor = "#16a34a")}
              onMouseLeave={(e) => !isCalling && (e.target.style.backgroundColor = "#22c55e")}
            >
              {isCalling ? (
                <>
                  <span style={{ fontSize: "20px" }} className="animate-spin">🔄</span>
                  Calling...
                </>
              ) : (
                <>
                  <span style={{ fontSize: "20px" }}>▶️</span>
                  Call Next Customer
                </>
              )}
            </button>
          </div>
        </div>
      </div>


      {/* Queue Status Overview */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto 24px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px"
      }}>
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
            Customers in queue
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
            Currently with staff
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
              Completed Today
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
              Auto-refreshes every 3 seconds
            </div>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Token</th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Customer Name</th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
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
                    <td style={{ padding: "16px" }}>
                      {q.status === "SERVING" && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button 
                            onClick={() => completeQueue(q.id)}
                            style={{
                              padding: "8px 12px",
                              backgroundColor: "#10b981",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600",
                              transition: "background-color 0.2s"
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "#10b981"}
                          >
                            Complete
                          </button>
                          <button 
                            onClick={() => skipQueue(q.id)}
                            style={{
                              padding: "8px 12px",
                              backgroundColor: "#f59e0b",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600",
                              transition: "background-color 0.2s"
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#d97706"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "#f59e0b"}
                          >
                            Skip
                          </button>
                        </div>
                      )}
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
            Staff Instructions:
          </h4>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px"
          }}>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>
              <li>Use "Call Next Customer" to serve the next person in queue</li>
              <li>Click "Complete" when finished attending to a customer</li>
              <li>Use "Skip" if a customer is not available (moves them to end of queue)</li>
              <li>The queue status updates automatically every 3 seconds</li>
            </ul>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>
              <li>Currently serving customers are highlighted in yellow</li>
              <li>Monitor the queue statistics for workload management</li>
              <li>Always verify customer identity before proceeding with service</li>
              <li>Universal queue system - no department separation</li>
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

export default StaffInterface;
