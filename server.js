import express from "express";
import dotenv from "dotenv";

import proxyRoute from "./routes/proxy.js";
import adminRoute from "./routes/admin.js";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(logger);
app.use(express.static("public"));

app.use("/proxy", proxyRoute);
app.use("/admin", adminRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Study Proxy running on port ${PORT}`);
});
