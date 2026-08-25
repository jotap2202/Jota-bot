import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = new Anthropic();

const PORT = process.env.PORT || 4173;

const SYSTEM_PROMPT = `You are the structuring engine behind a concept demo called "AI Meeting & Event Concierge".
A meeting/event planner describes a request in free-form natural language. Your job is to turn it into a
structured event brief, and to ask ONE smart follow-up question about the single most important missing detail.

Respond with ONLY a single valid JSON object. No markdown fences, no commentary, no text before or after it.

JSON schema (use null for unknown scalar fields, [] for unknown array fields):
{
  "attendees": number or null,
  "destination": string or null,
  "duration_nights": number or null,
  "accommodation_tier": string or null,
  "transportation": string or null,
  "events": string[]  (e.g. "welcome reception", "final dinner"),
  "activities_count": number or null,
  "special_requests": string[],
  "missing_fields": string[]  (plain-language labels for anything important not mentioned, e.g. "dates", "budget range", "room configuration"),
  "follow_up_question": string  (one short, specific, professional clarifying question about the single most valuable missing field)
}

Be precise. Do not invent details the planner did not state. Only fill missing_fields with genuinely absent, meeting-relevant information.`;

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function extractJson(raw) {
  const cleaned = raw
    .trim()
    .replace(/^```(json)?/i, "")
    .replace(/```$/, "")
    .trim();
  return JSON.parse(cleaned);
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/structure") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 20_000) req.destroy();
    });
    req.on("end", async () => {
      let text;
      try {
        ({ text } = JSON.parse(body));
      } catch {
        return sendJson(res, 400, { error: "Invalid JSON body" });
      }
      if (!text || typeof text !== "string" || !text.trim()) {
        return sendJson(res, 400, { error: "Missing 'text' field" });
      }

      try {
        const response = await client.messages.create({
          model: "claude-opus-5",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          output_config: { effort: "low" },
          messages: [{ role: "user", content: text }],
        });

        const textBlock = response.content.find((b) => b.type === "text");
        const raw = textBlock ? textBlock.text : "";

        let structured;
        try {
          structured = extractJson(raw);
        } catch {
          return sendJson(res, 502, { error: "parse_failed", raw });
        }

        return sendJson(res, 200, { structured });
      } catch (err) {
        console.error(err);
        return sendJson(res, 500, { error: err?.message || "Unknown error calling Claude" });
      }
    });
    return;
  }

  // Static file serving for the /public frontend
  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = path.join(__dirname, "public", path.normalize(filePath).replace(/^(\.\.[/\\])+/, ""));

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    const type =
      ext === ".html" ? "text/html; charset=utf-8" :
      ext === ".css" ? "text/css" :
      ext === ".js" ? "text/javascript" :
      "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\nAI Concierge concept demo running at http://localhost:${PORT}\n`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("Note: ANTHROPIC_API_KEY is not set in this shell. Make sure it's exported, or that `ant auth login` has been run, before you demo live.\n");
  }
});
