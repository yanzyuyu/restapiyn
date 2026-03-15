import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import natural from "natural";
import { NodeHtmlMarkdown } from "node-html-markdown";
import axios from "axios";

export const coolRouter = Router();

// 1. Google Gemini AI API (If GEMINI_API_KEY is available)
coolRouter.post("/ai/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt in body" });
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: "GEMINI_API_KEY is not configured on the server." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    res.json({ success: true, data: { reply: response.text } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Natural Language Processing (Sentiment Analysis)
coolRouter.get("/nlp/sentiment", (req, res) => {
  try {
    const text = req.query.text as string;
    if (!text) return res.status(400).json({ error: "Missing text parameter" });
    
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");
    const words = new natural.WordTokenizer().tokenize(text) || [];
    const score = analyzer.getSentiment(words);
    
    let sentiment = "Neutral";
    if (score > 0.2) sentiment = "Positive";
    if (score < -0.2) sentiment = "Negative";
    if (score > 1) sentiment = "Very Positive";
    if (score < -1) sentiment = "Very Negative";

    res.json({ success: true, data: { score, sentiment } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Natural Language Processing (Language Detection)
coolRouter.get("/nlp/detect-language", (req, res) => {
  try {
     // NOTE: A more accurate library like `languagedetect` could be used, but simple heuristic:
     // We will just proxy to a fast free API for better accuracy
     const text = req.query.text as string;
     if (!text) return res.status(400).json({ error: "Missing text parameter" });
     res.json({ success: true, data: { note: "Currently using mock/simple detection", provided_text: text }});
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. HTML to Markdown Converter
coolRouter.post("/tools/html-to-markdown", (req, res) => {
  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: "Missing html in body" });
    const markdown = NodeHtmlMarkdown.translate(html);
    res.json({ success: true, data: { markdown } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Website Reader / Scraper (Read any website as text/markdown)
coolRouter.get("/tools/read-web", async (req, res) => {
    try {
        const url = req.query.url as string;
        if (!url) return res.status(400).json({ error: "Missing url parameter" });
        
        const response = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }
        });
        
        const markdown = NodeHtmlMarkdown.translate(response.data);
        res.json({ success: true, data: { url, content: markdown.substring(0, 5000) + "...\n\n(Truncated for API response)" } });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});
