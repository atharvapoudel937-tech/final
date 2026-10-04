import { db } from "./firebaseAdmin.js";
import { PRODUCTS_DATABASE } from "./productsData.js";

// Helper function to fetch products from Firestore or local fallback
export async function getProducts() {
  try {
    const snapshot = await db.collection("products").get();
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  } catch (err) {
    console.warn("Firestore fetch failed, using local database fallback:", err.message);
  }
  return PRODUCTS_DATABASE;
}

export async function runRagPipeline(query) {
  const products = await getProducts();
  const q = query.toLowerCase().trim();

  // 1. Return policy query
  if (q.includes("return") || q.includes("refund") || q.includes("exchange")) {
    return "We offer a 30-day hassle-free return and exchange policy on all unworn items with original tags.";
  }

  // 2. Shipping & delivery query
  if (q.includes("shipping") || q.includes("deliver") || q.includes("dispatch")) {
    return "Standard shipping takes 3-5 business days. Express 2-day shipping is available at checkout.";
  }

  // 3. Size query
  if (q.includes("size") || q.includes("fit") || q.includes("sizing")) {
    const sizes = ["S", "M", "L", "XL", "XXL"];
    return `Our jackets generally run true to size and are available in sizes: ${sizes.join(", ")}.`;
  }

  // 4. Waterproof / Weather queries
  if (q.includes("waterproof") || q.includes("rain") || q.includes("water resistant") || q.includes("weather")) {
    const matching = products.filter(
      (p) =>
        p.waterproof === true ||
        (p.description && p.description.toLowerCase().includes("waterproof")) ||
        (p.name && p.name.toLowerCase().includes("waterproof"))
    );

    if (matching.length > 0) {
      const names = matching.map((p) => p.name).join(", ");
      return `The following jackets are waterproof or water-resistant: ${names}.`;
    }
  }

  // 5. Price / Cost queries
  if (q.includes("price") || q.includes("cost") || q.includes("how much") || q.includes("cheap") || q.includes("expensive")) {
    const items = products.map((p) => {
      const priceVal = Number(p.price || 0).toFixed(2);
      return `• ${p.name}: $${priceVal}`;
    });
    return `Here are the prices for our jackets:\n\n${items.join("\n")}`;
  }

  // 6. Specific jacket product lookup by name match
  const matchedProduct = products.find(
    (p) => p.name && q.includes(p.name.toLowerCase())
  );

  if (matchedProduct) {
    const priceVal = Number(matchedProduct.price || 0).toFixed(2);
    return `${matchedProduct.name} ($${priceVal}): ${matchedProduct.description || "In stock and available now."}`;
  }

  // 7. General catalog overview query
  if (q.includes("all") || q.includes("list") || q.includes("catalog") || q.includes("available") || q.includes("product")) {
    const names = products.map((p) => p.name).join(", ");
    return `We currently have these outerwear styles in stock: ${names}.`;
  }

  // Strict Fallback for unrecognized queries
  return "Due to a lack of online information regarding your query, please contact our support team directly at 96555999.";
}