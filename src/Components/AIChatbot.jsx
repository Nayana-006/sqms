import React, { useState, useRef, useEffect } from "react";

const AIChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your queue management assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Simple rule-based responses
    if (message.includes("queue") || message.includes("wait")) {
      return "You can check your queue status by clicking the 'Refresh Status' button in your queue interface. Your position will update automatically every 5 seconds.";
    } else if (message.includes("help") || message.includes("support")) {
      return "I'm here to help! You can ask me about queue status, estimated wait times, or general information about our services.";
    } else if (message.includes("time") || message.includes("wait")) {
      return "Estimated wait times depend on the current queue length and service speed. Please check your queue status for the most accurate information.";
    } else if (message.includes("leave") || message.includes("cancel")) {
      return "You can leave the queue at any time by clicking the 'Leave Queue' button in your queue interface. Your position will be removed from the system.";
    } else if (message.includes("thank")) {
      return "You're welcome! If you need any more assistance, just let me know.";
    } else if (message.includes("hello") || message.includes("hi")) {
      return "Hello! How can I assist you with your queue today?";
    } else {
      return "I understand you're looking for information about queues. You can check your current status, estimated wait times, or ask about our services. Is there something specific you'd like to know?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "350px",
      height: "500px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      display: "flex",
      flexDirection: "column",
      zIndex: 1000,
      border: "1px solid #e0e0e0"
    }}>
      {/* Header */}
      <div style={{
        padding: "15px",
        backgroundColor: "#3498db",
        color: "white",
        borderRadius: "12px 12px 0 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "12px",
            height: "12px",
            backgroundColor: "#2ecc71",
            borderRadius: "50%",
            boxShadow: "0 0 8px #2ecc71"
          }}></div>
          <span style={{ fontWeight: "bold", fontSize: "14px" }}>AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >
          ×
        </button>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        padding: "15px",
        overflowY: "auto",
        backgroundColor: "#f8f9fa"
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: message.sender === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "10px 15px",
                borderRadius: "18px",
                backgroundColor: message.sender === "user" ? "#3498db" : "#ffffff",
                color: message.sender === "user" ? "white" : "#333",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
                {message.text}
              </div>
              <div style={{
                fontSize: "10px",
                color: message.sender === "user" ? "rgba(255,255,255,0.8)" : "#888",
                marginTop: "5px",
                textAlign: "right"
              }}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "10px"
          }}>
            <div style={{
              padding: "10px 15px",
              borderRadius: "18px",
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", gap: "4px" }}>
                <div style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#888",
                  borderRadius: "50%",
                  animation: "bounce 1.4s infinite ease-in-out both"
                }}></div>
                <div style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#888",
                  borderRadius: "50%",
                  animation: "bounce 1.4s infinite ease-in-out both",
                  animationDelay: "0.2s"
                }}></div>
                <div style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#888",
                  borderRadius: "50%",
                  animation: "bounce 1.4s infinite ease-in-out both",
                  animationDelay: "0.4s"
                }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: "15px",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e0e0e0",
        borderRadius: "0 0 12px 12px"
      }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "10px 15px",
              border: "1px solid #ddd",
              borderRadius: "20px",
              fontSize: "14px",
              outline: "none"
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            style={{
              padding: "10px 20px",
              backgroundColor: inputText.trim() ? "#27ae60" : "#bdc3c7",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: inputText.trim() ? "pointer" : "not-allowed",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => {
              if (inputText.trim()) {
                e.target.style.backgroundColor = "#229954";
              }
            }}
            onMouseOut={(e) => {
              if (inputText.trim()) {
                e.target.style.backgroundColor = "#27ae60";
              }
            }}
          >
            Send
          </button>
        </div>
        <div style={{
          fontSize: "11px",
          color: "#888",
          textAlign: "center",
          marginTop: "5px"
        }}>
          Tip: Ask about queue status, wait times, or how to use the system
        </div>
      </div>

      {/* CSS for typing animation */}
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
};

export default AIChatbot;