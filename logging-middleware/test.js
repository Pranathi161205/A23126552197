console.log(
  "TOKEN:",
  process.env.ACCESS_TOKEN?.substring(0, 30) + "..."
);
import { Log } from "./logger.js";
await Log(
  "backend",
  "info",
  "middleware",
  "Logging middleware initialized"
);