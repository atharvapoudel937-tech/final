import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { getProducts, runRagPipeline } from "./ragService.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/products", async (req, res) => {
  const products = await getProducts();
  res.json(products);
});

app.post("/api/chat", async (req, res) => {
  const { query } = req.body;
  const answer = await runRagPipeline(query);
  res.json({ answer });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});