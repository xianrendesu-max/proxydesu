import express from "express";
import { ALLOW_LIST } from "../config/allowlist.js";
import { apiKeyAuth } from "../middleware/auth.js";
import { limiter } from "../middleware/rateLimit.js";
import { safeFetch } from "../services/fetcher.js";

const router = express.Router();

router.get("/", apiKeyAuth, limiter, async (req, res, next) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("url parameter required");

  const allowed = ALLOW_LIST.some(domain => url.startsWith(domain));
  if (!allowed) return res.status(403).send("URL not allowed");

  try {
    const response = await safeFetch(url);
    const body = await response.text();

    res.set({
      "Content-Type": response.headers.get("content-type") || "text/plain",
      "X-Proxy-By": "study-proxy-prod"
    });

    res.send(body);
  } catch (err) {
    next(err);
  }
});

export default router;
