import { Router } from "express";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import stringSimilarity from "string-similarity";
import ms from "ms";
import osu from "node-os-utils";

export const freeToolsRouter = Router();

// 1. Text Similarity API (Compare two texts)
freeToolsRouter.post("/tools/text-similarity", (req, res) => {
  try {
    const { text1, text2 } = req.body;
    if (!text1 || !text2) return res.status(400).json({ error: "Missing text1 or text2 in body" });
    
    const similarity = stringSimilarity.compareTwoStrings(text1, text2);
    const percentage = (similarity * 100).toFixed(2) + "%";

    res.json({ success: true, data: { similarity, percentage } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Generate Pie Chart Image API
freeToolsRouter.get("/tools/chart/pie", async (req, res) => {
  try {
    const labels = (req.query.labels as string || "A,B,C").split(",");
    const data = (req.query.data as string || "30,40,30").split(",").map(Number);
    const title = req.query.title as string || "Pie Chart";

    const width = 400;
    const height = 400;
    const backgroundColour = 'white';
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

    const configuration: any = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: data,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)'
          ],
        }]
      }
    };

    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Generate Bar Chart Image API
freeToolsRouter.get("/tools/chart/bar", async (req, res) => {
    try {
      const labels = (req.query.labels as string || "Jan,Feb,Mar").split(",");
      const data = (req.query.data as string || "10,20,30").split(",").map(Number);
      const title = req.query.title as string || "Bar Chart";
  
      const width = 500;
      const height = 400;
      const backgroundColour = 'white';
      const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });
  
      const configuration: any = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: title,
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
          }]
        }
      };
  
      const image = await chartJSNodeCanvas.renderToBuffer(configuration);
      res.set('Content-Type', 'image/png');
      res.send(image);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
});

// 4. Server Stats / System Info API
freeToolsRouter.get("/info/server-stats", async (req, res) => {
    try {
        const cpuUsage = await osu.cpu.usage();
        const memInfo = await osu.mem.info();
        const osCmd = await osu.os.oos();
        const ip = osu.os.ip();

        res.json({
            success: true,
            data: {
                cpuUsage: `${cpuUsage}%`,
                memory: {
                    total: `${memInfo.totalMemMb} MB`,
                    used: `${memInfo.usedMemMb} MB`,
                    free: `${memInfo.freeMemMb} MB`,
                    usedPercentage: `${(100 - memInfo.freeMemPercentage).toFixed(2)}%`
                },
                os: osCmd,
                ip: ip,
                uptime: ms(osu.os.uptime() * 1000, { long: true })
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 5. Time Parser API
freeToolsRouter.get("/tools/time-parse", (req, res) => {
    try {
        const timeString = req.query.time as string;
        if (!timeString) return res.status(400).json({ error: "Missing time parameter (e.g. 2 days, 1h, 5m)" });
        
        const milliseconds = ms(timeString);
        if (!milliseconds) return res.status(400).json({ error: "Invalid time format" });

        res.json({
            success: true,
            data: {
                original: timeString,
                milliseconds: milliseconds,
                seconds: milliseconds / 1000,
                minutes: milliseconds / 60000,
                hours: milliseconds / 3600000,
                days: milliseconds / 86400000,
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 6. Color Generator API
freeToolsRouter.get("/tools/color", (req, res) => {
    const randomHex = Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const r = parseInt(randomHex.substring(0,2), 16);
    const g = parseInt(randomHex.substring(2,4), 16);
    const b = parseInt(randomHex.substring(4,6), 16);

    res.json({
        success: true,
        data: {
            hex: `#${randomHex.toUpperCase()}`,
            rgb: `rgb(${r}, ${g}, ${b})`,
            rgba: `rgba(${r}, ${g}, ${b}, 1)`
        }
    });
});
