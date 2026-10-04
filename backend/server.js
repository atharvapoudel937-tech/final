import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Load your actual 10-jacket JSON file or dataset
let jackets = [];
try {
  const data = fs.readFileSync('./jackets.json', 'utf8'); // or require('./jackets.json')
  jackets = JSON.parse(data);
} catch (err) {
  console.error("Error reading jackets.json, falling back to data array:", err);
}

// 1. GET /api/jackets returns all 10 jackets
app.get('/api/jackets', (req, res) => {
  res.json(jackets);
});

// 2. POST /api/chat runs your actual RAG pipeline
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // -------------------------------------------------------------
    // REPLACE THIS WITH YOUR RAG / LLM / VECTOR SEARCH LOGIC:
    // e.g., const reply = await runRagQuery(message, jackets);
    // -------------------------------------------------------------
    
    // Example basic match against jacket descriptions if offline/mock RAG:
    const query = message.toLowerCase();
    const matched = jackets.filter(j => 
      j.description.toLowerCase().includes('cold') || 
      j.name.toLowerCase().includes('cold') ||
      j.description.toLowerCase().includes('waterproof')
    );

    let answer = "";
    if (matched.length > 0) {
      answer = `Based on your request, I recommend the ${matched[0].name} ($${matched[0].price}). ${matched[0].description}`;
    } else {
      answer = `We have ${jackets.length} jackets available in our catalog. Could you specify if you need waterproof protection, extreme insulation, or lightweight styling?`;
    }

    res.json({ reply: answer });
  } catch (error) {
    console.error("RAG processing error:", error);
    res.status(500).json({ reply: "An error occurred processing your request." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));