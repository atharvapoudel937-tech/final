import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Inside your main component function (e.g., function App() or function Chat()):
const [input, setInput] = useState("");

const handleSend = async () => {
  if (!input.trim()) return;

  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: input }) // or { message: input } depending on what your backend expects
  });
};

import { 
  ShoppingBag, 
  MessageSquare, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Send, 
  Bot,
  CheckCircle2
} from 'lucide-react';

const FALLBACK_10_JACKETS = [
  {
    id: '1',
    name: 'Thermal Ridge Waterproof Parka',
    price: 249.99,
    description: 'Triple-layer waterproof shell featuring high-density insulation.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Stealth Matte Puffer Jacket',
    price: 189.50,
    description: 'Minimalist streetwear silhouette with lightweight synthetic down.',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Alpine Traverse Hardshell',
    price: 299.00,
    description: 'Designed for rugged conditions with seam-sealed construction.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'Nordic Heritage Wool Bomber',
    price: 210.00,
    description: 'Heavyweight wool-blend outerwear with ribbed collar.',
    image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'Urban Expedition Windbreaker',
    price: 135.00,
    description: 'Ultra-lightweight packable storm protection with zip utility pockets.',
    image: 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    name: 'Glacier Shield Down Anorak',
    price: 320.00,
    description: '700-fill power down pull-over engineered for extreme sub-zero comfort.',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '7',
    name: 'Tactical Recon Softshell',
    price: 175.00,
    description: 'Fleece-lined stretch weave jacket built for mobility and weather resistance.',
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '8',
    name: 'Vanguard Quilted Overshirt',
    price: 145.00,
    description: 'Casual insulated shacket crafted with diamond quilting and button snap closure.',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '9',
    name: 'Summit Peak Fleece Hybrid',
    price: 160.00,
    description: 'Dual-fabric thermal layer combining fleece warmth with wind-proof chest panels.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '10',
    name: 'Cyberpunk Reflective Trench',
    price: 350.00,
    description: 'Technical long coat featuring high-visibility reflective trim and magnetic storm flaps.',
    image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=800'
  }
];

const SUGGESTED_QUESTIONS = [
  "What jacket prices do you have?",
  "Which jacket is waterproof?",
  "What sizes are available for jackets?",
  "What is your return policy?"
];

export default function App() {
  const [products, setProducts] = useState(FALLBACK_10_JACKETS);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  
  // Cart & Order State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! Select a suggested question below or ask me a question.' }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Automatically load all jackets from backend
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});
  }, []);

  // Cart Handlers
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleCheckout = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setOrderPlaced(false);
      setIsCartOpen(false);
    }, 2500);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Chat Handler
  const handleSendMessage = async (e, forcedMessage = null) => {
    if (e) e.preventDefault();
    const message = forcedMessage || inputQuery;
    if (!message.trim()) return;

    if (!forcedMessage) setInputQuery('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: message }]);
    setIsChatOpen(true);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message })
      });
      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.answer || data.response || 'I have pulled details regarding that request.' }
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: "Due to a lack of online information regarding your query, please contact our support team directly at 96555999." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between backdrop-blur-sm">
        <span className="font-bold text-lg tracking-wider text-slate-100">OUTERWEAR ARCHIVE</span>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition"
        >
          <ShoppingBag className="w-5 h-5 text-slate-300" />
          <span className="text-sm">Cart</span>
          {cartItemCount > 0 && (
            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>
      </header>

      {/* Catalog Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <p className="text-slate-400 text-xs mb-6 text-center">
          Showing {products.length} outerwear styles in stock
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              onMouseEnter={() => setHoveredProduct(product)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all flex flex-col justify-between"
            >
              <div>
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1544441893-675973e31985'}
                  alt={product.name}
                  className="w-full aspect-[4/5] object-cover rounded-xl mb-4 bg-slate-800"
                />
                <h3 className="font-medium text-slate-100 mb-1">{product.name}</h3>
                <p className="text-slate-400 text-xs mb-3 leading-relaxed">{product.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-100">${Number(product.price).toFixed(2)}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Hover Floating Context Chatbot Bar */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
        {!isChatOpen && hoveredProduct && (
          <div className="pointer-events-auto mb-3 bg-slate-900 border border-indigo-500/50 p-4 rounded-2xl shadow-2xl max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center gap-2 mb-1 text-indigo-400">
              <Bot className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">AI Assistant</span>
            </div>
            <p className="text-xs text-slate-200 mb-3 leading-relaxed">
              Oh, thinking about the <span className="font-semibold text-indigo-300">{hoveredProduct.name}</span>?
            </p>
            <button
              onClick={() => handleSendMessage(null, `Tell me more about the ${hoveredProduct.name}`)}
              className="w-full py-1.5 px-3 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs rounded-lg transition"
            >
              Ask AI about this jacket
            </button>
          </div>
        )}

        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="pointer-events-auto p-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl transition active:scale-95"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Interactive Chat Drawer */}
      {isChatOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <span className="font-medium text-sm">AI Assistant</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs text-slate-400 animate-pulse">Thinking...</div>
            )}
          </div>

          {/* Quick Questions Section */}
          <div className="p-2 border-t border-slate-800/80 bg-slate-950/50 flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(null, q)}
                disabled={loading}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-200 px-2.5 py-1 rounded-lg transition text-left"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
            />
            <button type="submit" disabled={loading} className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Cart & Order Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-slate-900 h-full border-l border-slate-800 p-5 flex flex-col z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="font-semibold text-slate-100">Shopping Cart</span>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {orderPlaced ? (
                <div className="text-center py-20 flex flex-col items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-12 h-12 animate-bounce" />
                  <p className="font-medium text-base">Order Placed Successfully!</p>
                </div>
              ) : cart.length === 0 ? (
                <p className="text-center text-slate-500 py-20 text-sm">Cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg bg-slate-800" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-medium">{item.name}</h4>
                        <span className="text-xs text-slate-400">${Number(item.price).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-slate-800 rounded bg-slate-900">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-indigo-400">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-indigo-400">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-slate-500 hover:text-rose-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && !orderPlaced && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}