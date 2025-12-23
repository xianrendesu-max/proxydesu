export function errorHandler(err, _req, res, _next) {
  console.error("[ERROR]", err.message);
  res.status(502).json({
    error: "Upstream request failed"
  });
}
