import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Pre-existing starter questions for the RAG chatbot
const STARTER_QUESTIONS = [
  "Which jacket is best for extreme cold?",
  "Are any jackets waterproof?",
  "What is your price range for puffers?",
  "Tell me about the Thermal Ridge Parka."
];

function App() {
  const [jackets, setJackets] = useState([]);
  const [cart, setCart] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm your AI shopping assistant. Ask me anything about our jackets!" }
  ]);
  const [loading, setLoading] = useState(false);

  // Fetch jackets from Render backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/jackets`)
      .then((res) => res.json())
      .then((data) => setJackets(data))
      .catch((err) => console.error("Error fetching jackets:", err));
  }, []);

  const addToCart = (jacket) => {
    setCart((prev) => [...prev, jacket]);
  };

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await response.json();
      
      const botReply = data.reply || data.message || "Sorry, I couldn't process that request.";
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [...prev, { role: "bot", text: "Error connecting to AI assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Header / Navbar */}
      <header style={{ backgroundColor: '#0f172a', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>Apex Outerwear Store</h1>
        <div>Cart ({cart.length})</div>
      </header>

      {/* Main E-Commerce Content */}
      <main style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>Featured Jackets</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {jackets.map((j) => (
            <div key={j.id || j.name} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img src={j.image} alt={j.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{j.name}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', flex: 1 }}>{j.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${j.price}</span>
                  <button 
                    onClick={() => addToCart(j)}
                    style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#fff',
          border: 'none',
          borderRadius: '50px',
          padding: '14px 24px',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}
      >
        {isChatOpen ? "Close Assistant ✕" : "💬 Ask AI Assistant"}
      </button>

      {/* Floating RAG Chatbot Drawer */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          width: '360px',
          height: '500px',
          backgroundColor: '#fff',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{ backgroundColor: '#0f172a', color: '#fff', padding: '14px 16px', fontWeight: 'bold', fontSize: '15px' }}>
            AI Shopping Assistant
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: m.role === 'user' ? '#0284c7' : '#f1f5f9',
                  color: m.role === 'user' ? '#fff' : '#0f172a',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && <div style={{ color: '#94a3b8', fontSize: '13px' }}>AI is thinking...</div>}
          </div>

          {/* Pre-existing Starter Questions */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #f1f5f9', backgroundColor: '#fafafa', display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {STARTER_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '11px',
                  backgroundColor: '#e2e8f0',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  color: '#334155'
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
            <button 
              onClick={() => handleSend()}
              style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Send
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;