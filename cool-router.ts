import { Router } from "express";
import natural from "natural";
import { NodeHtmlMarkdown } from "node-html-markdown";
import axios from "axios";
import { search } from "duck-duck-scrape";

export const coolRouter = Router();

// 1. Free Image Search API (using DuckDuckGo)
coolRouter.get("/tools/image-search", async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) return res.status(400).json({ error: "Missing query parameter 'q'" });
    
    const searchResults = await search(query, {
      safeSearch: "moderate"
    });

    // Extract image results if they exist, or just general web results
    const results = searchResults.results.slice(0, 10).map(r => ({
      title: r.title,
      description: r.description,
      url: r.url,
      icon: r.icon
    }));

    res.json({ success: true, data: results });
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

// 3. Natural Language Processing (Language Detection Mock -> Auto Correct/Suggest)
coolRouter.get("/nlp/spell-check", (req, res) => {
  try {
     const word = req.query.word as string;
     if (!word) return res.status(400).json({ error: "Missing word parameter" });
     
     const corpus = ["hello", "world", "computer", "science", "programming", "javascript", "typescript", "python", "developer", "engineer"];
     const spellcheck = new natural.Spellcheck(corpus);
     
     const isCorrect = spellcheck.isCorrect(word.toLowerCase());
     const corrections = spellcheck.getCorrections(word.toLowerCase(), 1);

     res.json({ success: true, data: { original: word, isCorrect, suggestions: corrections }});
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
