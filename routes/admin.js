import express from "express";
import { logs } from "../middleware/logger.js";

const router = express.Router();

router.post("/login", (req, res) => {
  if (req.body.password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false });
});

router.get("/logs", (_req, res) => {
  res.json(logs);
});

export default router;
