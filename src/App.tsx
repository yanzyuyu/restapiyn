import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Download,
  Music,
  QrCode,
  Hash,
  Binary,
  Play,
  Copy,
  CheckCircle2,
  Terminal,
  Activity,
  Server,
  Code2,
  ChevronRight,
  RefreshCw,
  Clock,
  ChevronDown,
  Film
} from "lucide-react";
import { extraEndpoints } from "./extra-endpoints";
import { usefulEndpoints } from "./useful-endpoints";
import { coolEndpoints } from "./cool-endpoints";

const baseEndpoints = [
  {
    id: "tiktok-download",
    title: "TikTok Downloader",
    category: "Downloader Tools",
    method: "GET",
    path: "/api/download/tiktok",
    description: "Download videos from TikTok.",
    params: [{ name: "url", type: "string", description: "TikTok Video URL" }],
    icon: <Film className="w-5 h-5" />,
    example: "/api/download/tiktok?url=https://www.tiktok.com/@tiktok/video/123",
  },
  {
    id: "ig-download",
    title: "Instagram Downloader",
    category: "Downloader Tools",
    method: "GET",
    path: "/api/download/ig",
    description: "Download videos/reels from Instagram.",
    params: [{ name: "url", type: "string", description: "Instagram Video URL" }],
    icon: <Film className="w-5 h-5" />,
    example: "/api/download/ig?url=https://www.instagram.com/reel/C_XvXv/",
  },
  {
    id: "twitter-download",
    title: "Twitter Downloader",
    category: "Downloader Tools",
    method: "GET",
    path: "/api/download/twitter",
    description: "Download videos from Twitter/X.",
    params: [{ name: "url", type: "string", description: "Twitter Video URL" }],
    icon: <Film className="w-5 h-5" />,
    example: "/api/download/twitter?url=https://x.com/user/status/123",
  },
  {
    id: "fb-download",
    title: "Facebook Downloader",
    category: "Downloader Tools",
    method: "GET",
    path: "/api/download/fb",
    description: "Download videos from Facebook.",
    params: [{ name: "url", type: "string", description: "Facebook Video URL" }],
    icon: <Film className="w-5 h-5" />,
    example: "/api/download/fb?url=https://www.facebook.com/watch/?v=123",
  },
  {
    id: "yt-search",
    title: "YouTube Search",
    category: "Downloader Tools",
    method: "GET",
    path: "/api/yt/search",
    description: "Search for YouTube videos by keyword.",
    params: [{ name: "q", type: "string", description: "Search query" }],
    icon: <Search className="w-5 h-5" />,
    example: "/api/yt/search?q=never+gonna+give+you+up",
  },
  {
    id: "yt-download",
    title: "YouTube Downloader",
    category: "Downloader Tools",
    method: "GET",
    path: "/api/yt/download",
    description: "Get download links and video info for a YouTube URL.",
    params: [{ name: "url", type: "string", description: "YouTube video URL" }],
    icon: <Download className="w-5 h-5" />,
    example: "/api/yt/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "yt-mp3",
    title: "YouTube MP3",
    category: "Downloader Tools",
    method: "GET",
    path: "/api/yt/ytmp3",
    description: "Download MP3 audio from a YouTube URL.",
    params: [{ name: "url", type: "string", description: "YouTube video URL" }],
    icon: <Music className="w-5 h-5" />,
    example: "/api/yt/ytmp3?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
    {
    id: "qrcode",
    title: "QR Code Generator",
    category: "Media Tools",
    method: "GET",
    path: "/api/tools/qrcode",
    description: "Generate a QR code from text or URL.",
    params: [{ name: "text", type: "string", description: "Text to encode" }],
    icon: <QrCode className="w-5 h-5" />,
    example: "/api/tools/qrcode?text=https://example.com",
  },
  {
    id: "uuid",
    title: "UUID Generator",
    category: "Tools & Utilities",
    method: "GET",
    path: "/api/tools/uuid",
    description: "Generate a random UUID v4.",
    params: [],
    icon: <Hash className="w-5 h-5" />,
    example: "/api/tools/uuid",
  },
  {
    id: "base64",
    title: "Base64 Encoder/Decoder",
    category: "Tools & Utilities",
    method: "POST",
    path: "/api/tools/base64",
    description: "Encode or decode text to/from Base64.",
    body: [
      { name: "action", type: "string", description: "'encode' or 'decode'" },
      { name: "text", type: "string", description: "Text to process" },
    ],
    icon: <Binary className="w-5 h-5" />,
    example: '{"action": "encode", "text": "Hello World"}',
  },
];

const endpoints = [...baseEndpoints, ...usefulEndpoints, ...coolEndpoints, ...extraEndpoints];

export default function App() {
  const [activeTab, setActiveTab] = useState<"docs" | "monitor">("docs");

  // Docs State
  const [activeEndpoint, setActiveEndpoint] = useState(endpoints[0]);
  const [testInput, setTestInput] = useState("");
  const [testAction, setTestAction] = useState("encode");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cookieInput, setCookieInput] = useState("");

  // Accordion State for Categories
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    "Downloader Tools": true,
    "AI & Smart Tools": true,
    "Useful Information": true
  });

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const categories = useMemo(() => {
    const cats: Record<string, typeof endpoints> = {};
    endpoints.forEach(ep => {
      if (!cats[ep.category]) cats[ep.category] = [];
      cats[ep.category].push(ep);
    });
    return cats;
  }, []);

  // Monitor State
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch("/api/logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === "monitor") {
      fetchLogs();
      const interval = setInterval(fetchLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = async () => {
    setLoading(true);
    setResponse(null);

    try {
      let res;
      if (activeEndpoint.method === "GET") {
        let url = activeEndpoint.path;
        const params: string[] = [];
        if (activeEndpoint.params?.length > 0) {
          if (activeEndpoint.params.length === 2 && activeEndpoint.params[0].name === "a" && activeEndpoint.params[1].name === "b") {
             // quick fix for math 2 params test UI
             const parts = testInput.split(',');
             params.push(`a=${encodeURIComponent(parts[0] || '0')}`);
             params.push(`b=${encodeURIComponent(parts[1] || '0')}`);
          } else {
             params.push(`${activeEndpoint.params[0].name}=${encodeURIComponent(testInput)}`);
          }
        }
        if (cookieInput) {
          params.push(`cookies=${encodeURIComponent(cookieInput)}`);
        }
        if (params.length) {
          url += `?${params.join("&")}`;
        }
        res = await fetch(url);
      } else {
        res = await fetch(activeEndpoint.path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: testAction, text: testInput }),
        });
      }
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setResponse(data);
      } else {
        const textData = await res.text();
        setResponse({ raw: textData });
      }
    } catch (error: any) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
              Nexus<span className="text-emerald-400">API</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex bg-zinc-900/80 p-1 rounded-full border border-zinc-800">
              <button
                onClick={() => setActiveTab("docs")}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                  activeTab === "docs"
                    ? "bg-zinc-800 text-zinc-100 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                API Docs
              </button>
              <button
                onClick={() => setActiveTab("monitor")}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                  activeTab === "monitor"
                    ? "bg-zinc-800 text-zinc-100 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Monitor
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full">
              <Activity className="w-4 h-4" />
              <span>System Online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "docs" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar with Accordion */}
            <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(categories).map(([category, eps]) => (
                <div key={category} className="mb-2">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider hover:text-zinc-200 transition-colors"
                  >
                    <span>{category}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openCategories[category] ? "rotate-180" : ""}`} />
                  </button>
                  
                  <div className={`space-y-1 mt-2 overflow-hidden transition-all duration-300 ${openCategories[category] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                    {eps.map((ep) => (
                      <button
                        key={ep.id}
                        onClick={() => {
                          setActiveEndpoint(ep);
                          setTestInput("");
                          setResponse(null);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                          activeEndpoint.id === ep.id
                            ? "bg-zinc-800/80 text-zinc-100 shadow-sm border border-zinc-700/50"
                            : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                        }`}
                      >
                        <div
                          className={`${
                            activeEndpoint.id === ep.id
                              ? "text-emerald-400"
                              : "text-zinc-500"
                          }`}
                        >
                          {ep.icon}
                        </div>
                        <span className="font-medium text-left truncate">{ep.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-6">
              {/* API Docs Card */}
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-zinc-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1 block">
                        {activeEndpoint.category}
                      </span>
                      <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">
                        {activeEndpoint.title}
                      </h2>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wider ${
                        activeEndpoint.method === "GET"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {activeEndpoint.method}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {activeEndpoint.description}
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Endpoint URL */}
                  <div>
                    <h3 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-zinc-500" />
                      Endpoint URL
                    </h3>
                    <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                      <code className="flex-1 px-3 py-2 text-sm text-zinc-300 font-mono overflow-x-auto">
                        {activeEndpoint.path}
                      </code>
                      <button
                        onClick={() => handleCopy(activeEndpoint.path)}
                        className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-md hover:bg-zinc-800"
                        title="Copy URL"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Parameters */}
                  {(activeEndpoint.params?.length > 0 ||
                    activeEndpoint.body?.length > 0) && (
                    <div>
                      <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-zinc-500" />
                        {activeEndpoint.method === "GET"
                          ? "Query Parameters"
                          : "Request Body"}
                      </h3>
                      <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                            <tr>
                              <th className="px-4 py-3 font-medium">Name</th>
                              <th className="px-4 py-3 font-medium">Type</th>
                              <th className="px-4 py-3 font-medium">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/50">
                            {(activeEndpoint.params || activeEndpoint.body).map(
                              (param, idx) => (
                                <tr
                                  key={idx}
                                  className="hover:bg-zinc-900/30 transition-colors"
                                >
                                  <td className="px-4 py-3 font-mono text-emerald-400">
                                    {param.name}
                                  </td>
                                  <td className="px-4 py-3 font-mono text-zinc-500">
                                    {param.type}
                                  </td>
                                  <td className="px-4 py-3 text-zinc-400">
                                    {param.description}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Playground Card */}
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/20">
                  <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                    <Play className="w-5 h-5 text-emerald-400" />
                    Playground
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    {activeEndpoint.id === "base64" && (
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                          <input
                            type="radio"
                            name="action"
                            value="encode"
                            checked={testAction === "encode"}
                            onChange={(e) => setTestAction(e.target.value)}
                            className="text-emerald-500 focus:ring-emerald-500 bg-zinc-900 border-zinc-700"
                          />
                          Encode
                        </label>
                        <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                          <input
                            type="radio"
                            name="action"
                            value="decode"
                            checked={testAction === "decode"}
                            onChange={(e) => setTestAction(e.target.value)}
                            className="text-emerald-500 focus:ring-emerald-500 bg-zinc-900 border-zinc-700"
                          />
                          Decode
                        </label>
                      </div>
                    )}

                    {activeEndpoint.params?.length > 0 && activeEndpoint.id !== "uuid" && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          {activeEndpoint.params.length === 2 && activeEndpoint.params[0].name === "a" ? "Input (comma separated, e.g. 5,10)" : activeEndpoint.params[0]?.description || "Input"}
                        </label>
                        <input
                          type="text"
                          value={testInput}
                          onChange={(e) => setTestInput(e.target.value)}
                          placeholder={`e.g., ${
                            activeEndpoint.id === "yt-search"
                              ? "never gonna give you up"
                              : activeEndpoint.id === "yt-download" || activeEndpoint.id === "yt-mp3"
                              ? "https://youtube.com/watch?v=..."
                              : activeEndpoint.params.length === 2 && activeEndpoint.params[0].name === "a"
                              ? "5,10"
                              : "Input value"
                          }`}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                        />
                      </div>
                    )}

                    {(activeEndpoint.id === "yt-download" || activeEndpoint.id === "yt-mp3") && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          YouTube Cookies (optional)
                        </label>
                        <input
                          type="text"
                          value={cookieInput}
                          onChange={(e) => setCookieInput(e.target.value)}
                          placeholder="SID=...; HSID=...;"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                        />
                        <p className="text-xs text-zinc-500 mt-1">
                          Optional: add YouTube cookies if the video requires sign-in.
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleTest}
                      disabled={loading || (activeEndpoint.params?.length > 0 && activeEndpoint.id !== "uuid" && !testInput && activeEndpoint.params[0].name !== "ip")}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-6 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Request
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Response Area */}
                  {response && (
                    <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-zinc-300">
                          Response
                        </h3>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            response.success ||
                            response.uuid ||
                            response.qrDataUrl ||
                            response.result ||
                            response.downloadUrl ||
                            response[0]?.word ||
                            response.setup
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {response.success ||
                          response.uuid ||
                          response.qrDataUrl ||
                          response.result ||
                          response.downloadUrl ||
                          response[0]?.word ||
                          response.setup
                            ? "200 OK"
                            : "Result / Error"}
                        </span>
                      </div>
                      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto">
                        {activeEndpoint.id === "qrcode" &&
                        response.data?.qrDataUrl ? (
                          <div className="flex flex-col items-center gap-4">
                            <img
                              src={response.data.qrDataUrl}
                              alt="QR Code"
                              className="w-48 h-48 bg-white p-2 rounded-lg"
                            />
                            <pre className="text-xs text-zinc-400 font-mono w-full overflow-x-auto">
                              {JSON.stringify(response, null, 2)}
                            </pre>
                          </div>
                        ) : activeEndpoint.id === "tools-screenshot" && response.data?.screenshotUrl ? (
                            <div className="flex flex-col items-center gap-4">
                            <img
                              src={response.data.screenshotUrl}
                              alt="Screenshot"
                              className="w-full max-w-md rounded-lg shadow-lg border border-zinc-700"
                            />
                            <pre className="text-xs text-zinc-400 font-mono w-full overflow-x-auto">
                              {JSON.stringify(response, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <>
                            {activeEndpoint.id === "yt-mp3" && response.streamUrl && (
                              <div className="mb-3">
                                <a
                                  href={response.streamUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20"
                                >
                                  Download MP3
                                  <ChevronRight className="w-4 h-4" />
                                </a>
                              </div>
                            )}
                            <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap break-all">
                              {JSON.stringify(response, null, 2)}
                            </pre>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">API Monitor</h2>
                <p className="text-zinc-400 text-sm mt-1">Real-time monitoring of all API requests.</p>
              </div>
              <button
                onClick={fetchLogs}
                disabled={loadingLogs}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${loadingLogs ? "animate-spin text-emerald-400" : ""}`} />
                Refresh
              </button>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Method</th>
                      <th className="px-6 py-4 font-medium">Endpoint</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Time</th>
                      <th className="px-6 py-4 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                          No requests logged yet. Try sending some requests from the API Docs.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold tracking-wider ${
                              log.method === "GET" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}>
                              {log.method}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-zinc-300 truncate max-w-[200px]" title={log.url}>
                            {log.url}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 ${
                              log.status >= 200 && log.status < 300 ? "text-emerald-400" :
                              log.status >= 400 ? "text-red-400" : "text-yellow-400"
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                log.status >= 200 && log.status < 300 ? "bg-emerald-400" :
                                log.status >= 400 ? "bg-red-400" : "bg-yellow-400"
                              }`} />
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-zinc-400">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-1.5 text-zinc-400 font-mono">
                              <Clock className="w-3.5 h-3.5" />
                              {log.duration}ms
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #3f3f46;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
