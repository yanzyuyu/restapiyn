import React from "react";
import { PieChart, BarChart2, ServerCog, Palette, ScanText, Timer } from "lucide-react";

export const freeToolsEndpoints = [
  {
    id: "tools-text-sim",
    title: "Text Similarity Checker",
    category: "Tools & Utilities",
    method: "POST",
    path: "/api/tools/text-similarity",
    description: "Compare two strings and get their similarity percentage. No API keys needed.",
    body: [
        { name: "text1", type: "string", description: "First text" },
        { name: "text2", type: "string", description: "Second text" }
    ],
    icon: <ScanText className="w-5 h-5" />,
    example: '{"text1": "I love programming", "text2": "I like programming"}',
  },
  {
    id: "chart-pie",
    title: "Generate Pie Chart",
    category: "Image Generators",
    method: "GET",
    path: "/api/tools/chart/pie",
    description: "Generate a Pie Chart image from comma-separated data. Returns a PNG image directly.",
    params: [
        { name: "labels", type: "string", description: "Comma separated labels (e.g. Apple,Banana,Orange)" },
        { name: "data", type: "string", description: "Comma separated values (e.g. 50,30,20)" },
        { name: "title", type: "string", description: "Chart title" }
    ],
    icon: <PieChart className="w-5 h-5" />,
    example: "/api/tools/chart/pie?labels=Win,Lose,Draw&data=60,30,10&title=Match+Stats",
  },
  {
    id: "chart-bar",
    title: "Generate Bar Chart",
    category: "Image Generators",
    method: "GET",
    path: "/api/tools/chart/bar",
    description: "Generate a Bar Chart image from comma-separated data. Returns a PNG image directly.",
    params: [
        { name: "labels", type: "string", description: "Comma separated labels (e.g. 2021,2022,2023)" },
        { name: "data", type: "string", description: "Comma separated values (e.g. 100,250,500)" },
        { name: "title", type: "string", description: "Chart title" }
    ],
    icon: <BarChart2 className="w-5 h-5" />,
    example: "/api/tools/chart/bar?labels=Jan,Feb,Mar&data=10,25,15&title=Sales",
  },
  {
    id: "info-server",
    title: "Server System Stats",
    category: "Useful Information",
    method: "GET",
    path: "/api/info/server-stats",
    description: "Get real-time CPU, RAM, and OS information of the server hosting this API.",
    params: [],
    icon: <ServerCog className="w-5 h-5" />,
    example: "/api/info/server-stats",
  },
  {
    id: "tools-timeparse",
    title: "Time String Parser",
    category: "Tools & Utilities",
    method: "GET",
    path: "/api/tools/time-parse",
    description: "Convert human readable time (e.g., '2 days', '10h') into milliseconds, seconds, minutes, etc.",
    params: [{ name: "time", type: "string", description: "Time string (e.g. 1d, 5h, 30m)" }],
    icon: <Timer className="w-5 h-5" />,
    example: "/api/tools/time-parse?time=2%20days",
  },
  {
    id: "tools-color",
    title: "Random Color Generator",
    category: "Tools & Utilities",
    method: "GET",
    path: "/api/tools/color",
    description: "Generate a random color and get its HEX, RGB, and RGBA values.",
    params: [],
    icon: <Palette className="w-5 h-5" />,
    example: "/api/tools/color",
  }
];
