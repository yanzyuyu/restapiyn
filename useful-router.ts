import { Router } from "express";
import axios from "axios";

export const usefulRouter = Router();

// IP Lookup
usefulRouter.get("/info/ip", async (req, res) => {
  try {
    const ip = req.query.ip as string || req.ip;
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    res.json({ success: true, data: response.data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GitHub User Info
usefulRouter.get("/info/github-user", async (req, res) => {
  try {
    const username = req.query.username as string;
    if (!username) return res.status(400).json({ error: "Missing username parameter" });
    const response = await axios.get(`https://api.github.com/users/${username}`);
    res.json({ success: true, data: response.data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
  }
});

// GitHub Repo Info
usefulRouter.get("/info/github-repo", async (req, res) => {
  try {
    const repo = req.query.repo as string; // Format: username/repo
    if (!repo || !repo.includes('/')) return res.status(400).json({ error: "Missing or invalid repo parameter (format: owner/repo)" });
    const response = await axios.get(`https://api.github.com/repos/${repo}`);
    res.json({ success: true, data: response.data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
  }
});

// Dictionary
usefulRouter.get("/info/dictionary", async (req, res) => {
  try {
    const word = req.query.word as string;
    if (!word) return res.status(400).json({ error: "Missing word parameter" });
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    res.json({ success: true, data: response.data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.response?.data?.title || error.message });
  }
});

// Weather (wttr.in JSON)
usefulRouter.get("/info/weather", async (req, res) => {
  try {
    const city = req.query.city as string;
    if (!city) return res.status(400).json({ error: "Missing city parameter" });
    const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
    res.json({ success: true, data: response.data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Random Joke
usefulRouter.get("/fun/joke", async (req, res) => {
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    res.json({ success: true, data: response.data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Random Quote
usefulRouter.get("/fun/quote", async (req, res) => {
  try {
    const response = await axios.get("https://dummyjson.com/quotes/random");
    res.json({ success: true, data: response.data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Screenshot API (proxying to a free service like microlink or sth similar)
usefulRouter.get("/tools/screenshot", (req, res) => {
  try {
    const url = req.query.url as string;
    if (!url) return res.status(400).json({ error: "Missing url parameter" });
    const screenshotUrl = `https://image.thum.io/get/${url}`;
    res.json({ success: true, data: { screenshotUrl } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
