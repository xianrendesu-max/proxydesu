import express from "express";
import { ALLOW_LIST } from "../config/allowlist.js";
import { limiter } from "../middleware/rateLimit.js";
import { safeFetch } from "../services/fetcher.js";

const router = express.Router();

router.get("/", limiter, async (req, res, next) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send("url parameter required");
  }

  /* ===============================
     ① allowlist チェック
     =============================== */
  const allowed = ALLOW_LIST.some(domain => url.startsWith(domain));
  if (!allowed) {
    return res.status(403).send("URL not allowed");
  }

  /* ===============================
     ② DuckDuckGo 判定
     =============================== */
  const isDuckDuckGo = url.startsWith("https://api.duckduckgo.com");

  /* ===============================
     ③ APIキー認証（DuckDuckGo以外）
     =============================== */
  if (!isDuckDuckGo) {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: "Invalid API key" });
    }
  }

  /* ===============================
     ④ フェッチ処理
     =============================== */
  try {
    const response = await safeFetch(url);
    const body = await response.text();

    res.set({
      "Content-Type": response.headers.get("content-type") || "text/plain",
      "X-Proxy-By": "study-proxy-prod",
      "X-Search-Provider": isDuckDuckGo ? "DuckDuckGo" : "Generic"
    });

    res.send(body);
  } catch (err) {
    next(err);
  }
});

export default router;
