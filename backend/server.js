import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for frontend cross-origin requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Complete 10-Jacket Inventory
const JACKETS_DATA = [
  {
    id: "1",
    name: "Thermal Ridge Waterproof Parka",
    price: 249.99,
    category: "Extreme Cold / Parka",
    waterproof: true,
    rating: 4.8,
    tags: ["waterproof", "extreme cold", "parka", "insulated", "heavy duty"],
    description: "Triple-layer waterproof shell featuring high-density insulation designed for arctic temperatures down to -20°C. Includes faux-fur hood trim and fleece-lined hand pockets.",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "2",
    name: "Stealth Matte Puffer Jacket",
    price: 189.50,
    category: "Puffer / Streetwear",
    waterproof: false,
    rating: 4.6,
    tags: ["puffer", "streetwear", "lightweight", "matte", "windproof"],
    description: "Minimalist streetwear silhouette with lightweight 700-fill synthetic down insulation, matte black finish, and elastic storm cuffs.",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "3",
    name: "Alpine Traverse Hardshell",
    price: 299.00,
    category: "Hardshell / Hiking",
    waterproof: true,
    rating: 4.9,
    tags: ["hardshell", "waterproof", "hiking", "breathable", "lightweight"],
    description: "Engineered for rugged alpine environments. Seam-sealed GORE-TEX breathable fabric with helmet-compatible storm hood and pit-zip ventilation.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "4",
    name: "Nordic Heritage Wool Bomber",
    price: 210.00,
    category: "Bomber / Casual",
    waterproof: false,
    rating: 4.5,
    tags: ["wool", "bomber", "casual", "heritage", "stylish"],
    description: "Classic flight bomber silhouette woven from a premium wool-blend exterior with satin interior lining and rib-knit cuffs.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "5",
    name: "Vanguard Tactical Softshell",
    price: 159.99,
    category: "Softshell / Tactical",
    waterproof: true,
    rating: 4.4,
    tags: ["softshell", "tactical", "water-resistant", "windproof", "utility"],
    description: "Flexible fleece-backed softshell providing water resistance, wind protection, and multi-pocket utility storage for active outdoor use.",
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "6",
    name: "Glacier Peak Down Anorak",
    price: 225.00,
    category: "Anorak / Down",
    waterproof: true,
    rating: 4.7,
    tags: ["anorak", "down", "pullover", "insulated", "waterproof"],
    description: "Half-zip pullover down anorak with a deep front pouch pocket, DWR water-repellent coating, and packable side-zip access.",
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "7",
    name: "Urban Commuter Trench Shield",
    price: 275.00,
    category: "Trench / Urban",
    waterproof: true,
    rating: 4.6,
    tags: ["trench", "urban", "commuter", "waterproof", "longline"],
    description: "Modernized longline trench coat built with fully waterproof membrane technology, magnetic pocket closures, and removable hood.",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "8",
    name: "Sierra Sherpa-Lined Trucker",
    price: 135.00,
    category: "Trucker / Sherpa",
    waterproof: false,
    rating: 4.3,
    tags: ["trucker", "sherpa", "denim", "casual", "cozy"],
    description: "Heavyweight cotton canvas trucker jacket fully lined with plush high-pile sherpa fleece for autumn and early winter warmth.",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "9",
    name: "Echo Featherweight Packable Windbreaker",
    price: 89.99,
    category: "Windbreaker / Running",
    waterproof: false,
    rating: 4.2,
    tags: ["windbreaker", "packable", "lightweight", "running", "active"],
    description: "Ultra-lightweight ripstop windbreaker that compresses down into its own zip pocket. Ideal for running, cycling, and emergency rain protection.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "10",
    name: "Polaris Heated Expedition Parka",
    price: 349.99,
    category: "Heated / Expedition",
    waterproof: true,
    rating: 5.0,
    tags: ["heated", "expedition", "extreme cold", "battery", "premium"],
    description: "Integrated carbon-fiber heating zones powered by a 10,000mAh USB power bank, paired with 800-fill goose down for extreme arctic climates.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800"
  }
];

// Health check root route
app.get('/', (req, res) => {
  res.send('Apex Outerwear Backend API is live!');
});

// GET /api/jackets - Returns all 10 jackets
app.get('/api/jackets', (req, res) => {
  res.json(JACKETS_DATA);
});

// Offline-Capable RAG Search Logic Engine
function performRagSearch(query, jackets) {
  const cleanQuery = query.toLowerCase();

  // 1. Check for specific jacket name matches
  const exactMatch = jackets.find(j => cleanQuery.includes(j.name.toLowerCase()));
  if (exactMatch) {
    return `The **${exactMatch.name}** costs **$${exactMatch.price}** (Rating: ${exactMatch.rating}/5). ${exactMatch.description}`;
  }

  // 2. Score jackets based on tag & keyword matching
  const scoredJackets = jackets.map(jacket => {
    let score = 0;
    jacket.tags.forEach(tag => {
      if (cleanQuery.includes(tag)) score += 3;
    });
    if (cleanQuery.includes(jacket.category.toLowerCase())) score += 4;
    if (cleanQuery.includes('waterproof') && jacket.waterproof) score += 5;
    if ((cleanQuery.includes('extreme') || cleanQuery.includes('cold') || cleanQuery.includes('snow') || cleanQuery.includes('arctic')) && (jacket.tags.includes('extreme cold') || jacket.tags.includes('heated'))) score += 5;
    if ((cleanQuery.includes('cheap') || cleanQuery.includes('budget') || cleanQuery.includes('affordable')) && jacket.price < 160) score += 4;
    if ((cleanQuery.includes('puffer') || cleanQuery.includes('down')) && (jacket.tags.includes('puffer') || jacket.tags.includes('down'))) score += 4;
    
    return { jacket, score };
  });

  // Sort by relevance score
  scoredJackets.sort((a, b) => b.score - a.score);
  const bestMatches = scoredJackets.filter(item => item.score > 0);

  if (bestMatches.length > 0) {
    const top = bestMatches[0].jacket;
    if (bestMatches.length > 1) {
      const second = bestMatches[1].jacket;
      return `Based on your request, I highly recommend the **${top.name}** ($${top.price}). ${top.description}\n\nAnother great option is the **${second.name}** ($${second.price}).`;
    }
    return `I recommend the **${top.name}** ($${top.price}). ${top.description}`;
  }

  // 3. General fallback summary if no specific criteria match
  return `We currently have **${jackets.length} jackets** in stock ranging from $89.99 to $349.99! We offer waterproof parkas, lightweight puffers, trench coats, and heated expedition jackets. What feature or weather condition are you shopping for?`;
}

// POST /api/chat - RAG endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ reply: "Please provide a valid question." });
  }

  const reply = performRagSearch(message, JACKETS_DATA);
  res.json({ reply });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));