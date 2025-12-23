import fetch from "node-fetch";
import { SECURITY } from "../config/security.js";

export async function safeFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SECURITY.TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
