import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import youtubedl from "youtube-dl-exec";
import ytSearch from "yt-search";
import qrcode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { extraRouter } from "./extra-router.js";
import { usefulRouter } from "./useful-router.js";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  app.use(cors());
  app.use(express.json());

  // In-memory request logs
  const requestLogs: any[] = [];
  app.use((req, res, next) => {
    if (!req.url.startsWith('/api')) return next();
    const start = Date.now();
    const id = uuidv4();
    res.on('finish', () => {
      const duration = Date.now() - start;
      requestLogs.unshift({
        id,
        method: req.method,
        url: req.originalUrl || req.url,
        status: res.statusCode,
        duration,
        timestamp: new Date().toISOString(),
      });
      if (requestLogs.length > 100) requestLogs.pop();
    });
    next();
  });

  // Load Extra APIs
  app.use("/api", extraRouter);
  app.use("/api", usefulRouter);

  // API Routes
  app.get("/api/logs", (req, res) => {
    res.json({ success: true, data: requestLogs });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "API is running smoothly!" });
  });

  // 1. YouTube Search API
  app.get("/api/yt/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Missing query parameter 'q'" });
      }
      const r = await ytSearch(query);
      const videos = r.videos.slice(0, 10).map((v) => ({
        title: v.title,
        url: v.url,
        thumbnail: v.thumbnail,
        duration: v.timestamp,
        author: v.author.name,
        views: v.views,
      }));
      res.json({ success: true, data: videos });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 2. YouTube Downloader API (Info & Formats)
  app.get("/api/yt/download", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) {
        return res.status(400).json({ error: "Invalid or missing YouTube URL" });
      }
      
      try {
        const info = await youtubedl(url, {
          dumpJson: true,
          noCheckCertificates: true,
          noWarnings: true,
          preferFreeFormats: true,
          // remove custom headers on Windows: passing User-Agent with spaces can break argument parsing
          // (youtube-dl-exec spawns a shell and splits args, causing invalid URL errors).
        });
        
        const videoFormats = info.formats
          .filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none')
          .map((f: any) => ({
            quality: f.format_note || f.resolution || "unknown",
            url: f.url,
            mimeType: f.ext,
          }));
          
        const audioFormats = info.formats
          .filter((f: any) => f.vcodec === 'none' && f.acodec !== 'none')
          .map((f: any) => ({
            quality: f.abr ? f.abr + "kbps" : "unknown",
            url: f.url,
            mimeType: f.ext,
          }));
        
        res.json({
          success: true,
          data: {
            title: info.title,
            thumbnail: info.thumbnail,
            duration: info.duration,
            videoFormats,
            audioFormats,
          },
        });
      } catch (err: any) {
        return res.status(500).json({
          success: false,
          error: "Gagal mengambil data dari YouTube. Mungkin diblokir atau URL tidak valid.",
          originalError: err.message
        });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 2b. YouTube MP3 endpoint
  // If ?stream=true is provided, this streams the mp3 directly.
  // Otherwise it returns JSON similar to /api/yt/download.
  app.get("/api/yt/ytmp3", async (req, res) => {
    const url = req.query.url as string;
    const stream = req.query.stream === "true" || req.query.stream === "1";

    if (!url) {
      return res.status(400).json({ error: "Invalid or missing YouTube URL" });
    }

    try {
      const cookies = req.query.cookies as string | undefined;
      const ytdlpOptions: any = {
        dumpJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
      };

      if (cookies) {
        ytdlpOptions.addHeader = [`cookie: ${cookies}`];
      }

      const info = await youtubedl(url, ytdlpOptions);
      const audioFormats = (info.formats || [])
        .filter((f: any) => f.acodec !== "none" && f.vcodec === "none")
        .map((f: any) => ({
          quality: f.abr ? `${f.abr}kbps` : "unknown",
          url: f.url,
          mimeType: f.ext,
          ext: f.ext,
        }));

      const mp3Formats = audioFormats.filter((f: any) => f.ext === "mp3");
      const best = mp3Formats[0] || audioFormats[0];

      if (stream) {
        if (!best?.url) {
          return res.status(400).json({
            success: false,
            error: "No streamable MP3 format available for this video.",
          });
        }

        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Disposition", "attachment; filename=download.mp3");
        res.setHeader("Cache-Control", "no-store");

        const subprocess = youtubedl.exec(
          url,
          {
            extractAudio: true,
            audioFormat: "mp3",
            output: "-",
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
          },
          { stdio: ["ignore", "pipe", "pipe"] }
        );

        subprocess.stdout.pipe(res);
        subprocess.stderr.pipe(process.stderr);

        req.on("close", () => {
          try {
            subprocess.kill("SIGKILL");
          } catch {
            // ignore
          }
        });
        return;
      }

      const host = `${req.protocol}://${req.get("host")}`;
      const streamUrl = `${host}/api/yt/ytmp3?url=${encodeURIComponent(url)}&stream=true${
        cookies ? `&cookies=${encodeURIComponent(cookies)}` : ""
      }`;

      res.json({
        success: true,
        data: {
          title: info.title,
          thumbnail: info.thumbnail,
          duration: info.duration,
          streamUrl,
          downloadUrl: best?.url || null,
          formats: audioFormats,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: "Gagal mengambil data dari YouTube. Mungkin diblokir atau URL tidak valid.",
        originalError: err.message,
      });
    }
  });

  // 3. QR Code Generator API
  app.get("/api/tools/qrcode", async (req, res) => {
    try {
      const text = req.query.text as string;
      if (!text) {
        return res.status(400).json({ error: "Missing text parameter" });
      }
      const qrDataUrl = await qrcode.toDataURL(text);
      res.json({ success: true, data: { qrDataUrl } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 4. UUID Generator API
  app.get("/api/tools/uuid", (req, res) => {
    res.json({ success: true, data: { uuid: uuidv4() } });
  });

  // 5. Base64 Encode/Decode API
  app.post("/api/tools/base64", (req, res) => {
    try {
      const { action, text } = req.body;
      if (!text || !["encode", "decode"].includes(action)) {
        return res.status(400).json({ error: "Invalid action or missing text" });
      }
      let result = "";
      if (action === "encode") {
        result = Buffer.from(text).toString("base64");
      } else {
        result = Buffer.from(text, "base64").toString("utf-8");
      }
      res.json({ success: true, data: { result } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
