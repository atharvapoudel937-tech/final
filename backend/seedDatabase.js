import { db } from "./firebaseAdmin.js";

const FRESH_PRODUCTS = [
  {
    id: "1",
    name: "Alpine Pro Waterproof Shell",
    price: 249.99,
    waterproof: true,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80",
    description: "Designed for heavy rain and mountain trekking. Highly breathable yet waterproof."
  },
  {
    id: "2",
    name: "Urban Arctic Down Parka",
    price: 299.99,
    waterproof: true,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80",
    description: "Heavy-duty winter protection tailored for sub-zero temperatures and snowy commutes."
  },
  {
    id: "3",
    name: "Retro Flight Bomber Jacket",
    price: 189.50,
    waterproof: false,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    description: "Iconic military-inspired flight jacket with a slim modern fit."
  },
  {
    id: "4",
    name: "Sherpa Fleece Utility Shacket",
    price: 145.00,
    waterproof: false,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80",
    description: "Cozy shirt-jacket cross ideal for mid-season layering."
  }
];

async function seed() {
  console.log("Clearing Firestore products...");
  const snapshot = await db.collection("products").get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log("Seeding fresh jacket data...");
  for (const item of FRESH_PRODUCTS) {
    await db.collection("products").doc(item.id).set(item);
  }
  console.log("Firestore updated successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});