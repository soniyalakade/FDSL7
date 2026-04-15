import dotenv from "dotenv";
dotenv.config();

import express from "express"; // Express
import cors from "cors"; // CORS for React dev server
import { MongoClient, ObjectId } from "mongodb"; // MongoDB


const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON body

// MongoDB Connection
const client = new MongoClient(process.env.MONGO_URI);
await client.connect();

const feedback = client
  .db("fsdl7")
  .collection("feedback");

// ================= ROUTES =================

// GET - Fetch feedback
app.get("/api/feedback", async (req, res) => {
  const list = await feedback
    .find()
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  res.json(list);
});

// POST - Add feedback
app.post("/api/feedback", async (req, res) => {
  const { student, rating, comment } = req.body;

  // Validation
  if (!student || !rating) {
    return res
      .status(400)
      .json({ error: "student and rating required" });
  }

  const doc = {
    student,
    rating: Number(rating),
    comment: comment || "",
    createdAt: new Date(),
  };

  await feedback.insertOne(doc);

  res.json({ ok: true });
});

// DELETE - Remove feedback
app.delete("/api/feedback/:id", async (req, res) => {
  await feedback.deleteOne({
    _id: new ObjectId(req.params.id),
  });

  res.json({ ok: true });
});

// ================= SERVER =================
app.listen(3001, () =>
  console.log("http://localhost:3001")
);