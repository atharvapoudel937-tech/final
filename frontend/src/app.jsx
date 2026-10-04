import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [jackets, setJackets] = useState([]);

  // Fetch jackets from backend on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/jackets`)
      .then((res) => res.json())
      .then((data) => setJackets(data))
      .catch((err) => console.error("Error fetching jackets:", err));
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      
      const botMsg = { role: "bot", text: data.reply || data.message || "No response received." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
    }

    setInput("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Jacket E-Commerce Store</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        {jackets.map((j) => (
          <div key={j.id || j.name} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
            <img src={j.image} alt={j.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
            <h3>{j.name}</h3>
            <p>${j.price}</p>
            <p style={{ fontSize: "12px", color: "#666" }}>{j.description}</p>
          </div>
        ))}
      </div>

      <h2>Assistant Chatbot</h2>
      <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px", minHeight: "200px", marginBottom: "16px" }}>
        {messages.map((m, idx) => (
          <p key={idx}><strong>{m.role === "user" ? "You" : "Bot"}:</strong> {m.text}</p>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about our jackets..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={handleSend} style={{ padding: "8px 16px" }}>Send</button>
      </div>
    </div>
  );
}

export default App;