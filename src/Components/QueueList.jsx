import React, { useEffect, useState } from "react";

const QueueList = () => {
  const [queues, setQueues] = useState([]);
  const [name, setName] = useState("");

const BASE_URL = "https://sqms-backend-3.onrender.com/api/queue";
  // Fetch all queues
  const fetchQueues = async () => {
    try {
      console.log("Fetching all queues...");
      const res = await fetch(BASE_URL);
      const data = await res.json();
      console.log("Queues fetched:", data);
      setQueues(data);
    } catch (err) {
      console.error("Error fetching queues:", err);
    }
  };

  // Call next queue
  const callNext = async () => {
    try {
      console.log("Calling next queue...");

      const res = await fetch(`${BASE_URL}/call-next`, {
        method: "POST"
      });

      await res.text();

      fetchQueues();
    } catch (err) {
      console.error("Error calling next:", err);
    }
  };

  // Add new queue
  const addQueue = async () => {
    if (!name) return alert("Enter a name");

    try {
      console.log("Adding queue:", name);

      const res = await fetch(
        `${BASE_URL}/add?name=${name}`,
        { method: "POST" }
      );

      await res.json();

      setName("");

      fetchQueues();
    } catch (err) {
      console.error("Error adding queue:", err);
    }
  };

  // Complete queue
  const completeQueue = async (id) => {
    try {
      console.log("Completing queue ID:", id);

      const res = await fetch(`${BASE_URL}/complete/${id}`, {
        method: "POST"
      });

      if (!res.ok) {
        throw new Error("Failed to complete queue");
      }

      await res.text();

      fetchQueues();
    } catch (err) {
      console.error("Error completing queue:", err);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Smart Queue Management</h2>

      {/* Add Queue */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={addQueue}>Add Queue</button>
      </div>

      {/* Call Next */}
      <button onClick={callNext} style={{ marginBottom: "10px" }}>
        Call Next
      </button>

      {/* Queue Table */}
      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Token</th>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {queues.map((q) => (
            <tr
              key={q.id}
              style={{
                backgroundColor:
                  q.status === "SERVING"
                    ? "#ffff99"
                    : q.status === "COMPLETED"
                    ? "#ccffcc"
                    : "white"
              }}
            >
              <td>{q.tokenNumber}</td>
              <td>{q.name}</td>
              <td>{q.status}</td>
              <td>
                {q.status === "SERVING" && (
                  <button onClick={() => completeQueue(q.id)}>
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueueList;