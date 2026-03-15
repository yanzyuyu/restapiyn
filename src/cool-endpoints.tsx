import React from "react";
import { Sparkles, BrainCircuit, FileCode2, BookOpenText } from "lucide-react";

export const coolEndpoints = [
  {
    id: "ai-gemini",
    title: "Gemini AI Chat",
    category: "AI & Smart Tools",
    method: "POST",
    path: "/api/ai/gemini",
    description: "Generate text using Google's Gemini 2.5 Flash AI model. (Requires GEMINI_API_KEY environment variable on server).",
    body: [{ name: "prompt", type: "string", description: "Prompt for the AI" }],
    icon: <Sparkles className="w-5 h-5" />,
    example: '{"prompt": "Tuliskan puisi pendek tentang coding"}',
  },
  {
    id: "nlp-sentiment",
    title: "Sentiment Analysis",
    category: "AI & Smart Tools",
    method: "GET",
    path: "/api/nlp/sentiment",
    description: "Analyze the sentiment (positive/negative/neutral) of an English text.",
    params: [{ name: "text", type: "string", description: "English sentence to analyze" }],
    icon: <BrainCircuit className="w-5 h-5" />,
    example: "/api/nlp/sentiment?text=I+absolutely+love+this+amazing+api",
  },
  {
    id: "tools-html2md",
    title: "HTML to Markdown",
    category: "Tools & Utilities",
    method: "POST",
    path: "/api/tools/html-to-markdown",
    description: "Convert raw HTML code into clean Markdown format.",
    body: [{ name: "html", type: "string", description: "HTML code string" }],
    icon: <FileCode2 className="w-5 h-5" />,
    example: '{"html": "<h1>Hello</h1><p>This is <b>bold</b></p>"}',
  },
  {
    id: "tools-readweb",
    title: "Website Reader (Markdown)",
    category: "Tools & Utilities",
    method: "GET",
    path: "/api/tools/read-web",
    description: "Scrape any website and return its content in readable Markdown format.",
    params: [{ name: "url", type: "string", description: "Target Website URL" }],
    icon: <BookOpenText className="w-5 h-5" />,
    example: "/api/tools/read-web?url=https://en.wikipedia.org/wiki/API",
  }
];
