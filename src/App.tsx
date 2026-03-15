import React, { useState } from "react";
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
} from "lucide-react";

const endpoints = [
  {
    id: "yt-search",
    title: "YouTube Search",
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

export default function App() {
  const [activeEndpoint, setActiveEndpoint] = useState(endpoints[0]);
  const [testInput, setTestInput] = useState("");
  const [testAction, setTestAction] = useState("encode");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = async () => {
    setLoading(true);
    setResponse(null);

    try {
      if (activeEndpoint.id === "yt-mp3") {
        const downloadUrl = `${activeEndpoint.path}?${activeEndpoint.params[0].name}=${encodeURIComponent(
          testInput
        )}`;
        setResponse({ downloadUrl });
        return;
      }

      let res;
      if (activeEndpoint.method === "GET") {
        let url = activeEndpoint.path;
        if (activeEndpoint.params.length > 0) {
          url += `?${activeEndpoint.params[0].name}=${encodeURIComponent(testInput)}`;
        }
        res = await fetch(url);
      } else {
        res = await fetch(activeEndpoint.path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: testAction, text: testInput }),
        });
      }
      const data = await res.json();
      setResponse(data);
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
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full">
              <Activity className="w-4 h-4" />
              <span>System Online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-3">
                Endpoints
              </h2>
              <nav className="space-y-1">
                {endpoints.map((ep) => (
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
                        activeEndpoint.id === ep.id ? "text-emerald-400" : "text-zinc-500"
                      }`}
                    >
                      {ep.icon}
                    </div>
                    <span className="font-medium">{ep.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* API Docs Card */}
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-zinc-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">
                    {activeEndpoint.title}
                  </h2>
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
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Parameters */}
                {(activeEndpoint.params?.length > 0 || activeEndpoint.body?.length > 0) && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-zinc-500" />
                      {activeEndpoint.method === "GET" ? "Query Parameters" : "Request Body"}
                    </h3>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Type</th>
                            <th className="px-4 py-3 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                          {(activeEndpoint.params || activeEndpoint.body).map((param, idx) => (
                            <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                              <td className="px-4 py-3 font-mono text-emerald-400">{param.name}</td>
                              <td className="px-4 py-3 font-mono text-zinc-500">{param.type}</td>
                              <td className="px-4 py-3 text-zinc-400">{param.description}</td>
                            </tr>
                          ))}
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

                  {activeEndpoint.id !== "uuid" && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        {activeEndpoint.params?.[0]?.description || "Input"}
                      </label>
                      <input
                        type="text"
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        placeholder={`e.g., ${
                          activeEndpoint.id === "yt-search"
                            ? "never gonna give you up"
                            : activeEndpoint.id === "yt-download"
                            ? "https://youtube.com/watch?v=..."
                            : "Hello World"
                        }`}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleTest}
                    disabled={loading || (activeEndpoint.id !== "uuid" && !testInput)}
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
                      <h3 className="text-sm font-medium text-zinc-300">Response</h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          response.success || response.uuid || response.qrDataUrl || response.result || response.downloadUrl
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {response.success || response.uuid || response.qrDataUrl || response.result || response.downloadUrl
                          ? "200 OK"
                          : "Error"}
                      </span>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto">
                      {activeEndpoint.id === "qrcode" && response.data?.qrDataUrl ? (
                        <div className="flex flex-col items-center gap-4">
                          <img src={response.data.qrDataUrl} alt="QR Code" className="w-48 h-48 bg-white p-2 rounded-lg" />
                          <pre className="text-xs text-zinc-400 font-mono w-full overflow-x-auto">
                            {JSON.stringify(response, null, 2)}
                          </pre>
                        </div>
                      ) : activeEndpoint.id === "yt-mp3" && response.downloadUrl ? (
                        <div className="space-y-3">
                          <a
                            href={response.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20"
                          >
                            Download MP3
                            <ChevronRight className="w-4 h-4" />
                          </a>
                          <pre className="text-xs text-zinc-400 font-mono w-full overflow-x-auto">
                            {JSON.stringify(response, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <pre className="text-sm text-zinc-300 font-mono">
                          {JSON.stringify(response, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
