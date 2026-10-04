import express from 'express';
import cors from 'cors';

const app = express();

// 1. Fix CORS to allow Vercel requests and preflight OPTIONS requests
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 2. Sample jackets endpoint (Fixes the 404 error)
app.get('/api/jackets', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Thermal Ridge Waterproof Parka",
      price: 249.99,
      description: "Triple-layer waterproof shell featuring high-density insulation.",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      name: "Stealth Matte Puffer Jacket",
      price: 189.50,
      description: "Minimalist streetwear silhouette with lightweight synthetic down.",
      image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800"
    }
  ]);
});

// 3. RAG Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  // Insert your RAG / Firebase / OpenAI query logic here
  res.json({ reply: `Received message: ${message}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));