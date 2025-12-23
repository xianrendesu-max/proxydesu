export const logs = [];

export function logger(req, _res, next) {
  logs.push({
    time: new Date().toISOString(),
    ip: req.ip,
    method: req.method,
    path: req.originalUrl
  });

  if (logs.length > 300) logs.shift();
  next();
}
