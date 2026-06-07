import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect database
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database not connected", err));

// Schema
const urlSchema = new mongoose.Schema({
  originalurl: String,
  shorturl: String,
  clicks: { type: Number, default: 0 },
});

const Url = mongoose.model('Url', urlSchema);

// POST: Generate short URL
app.post('/api/short', async (req, res) => {
  try {
    const { originalurl } = req.body;
    if (!originalurl) return res.status(400).json({ error: "Original URL is required" });

    const shorturl = nanoid(7);
    const newUrl = new Url({ originalurl, shorturl });
    await newUrl.save();

    res.status(200).json({ message: "URL generated", url: newUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Redirect using short URL
app.get("/:shortUrl", async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const urlData = await Url.findOne({ shorturl: shortUrl });

    if (!urlData) return res.status(404).json({ error: "URL not found" });

    urlData.clicks++;
    await urlData.save();

    res.redirect(urlData.originalurl);
  } catch (error) {
    console.error("Error finding URL:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(3000, () => console.log("Server is running on port 3000"));
