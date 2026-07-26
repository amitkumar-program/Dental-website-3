import express, { type Express } from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import path from "path";
import fs from "fs";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach user to every request (non-blocking — routes decide if auth is required)
app.use(authMiddleware);

app.use("/api", router);

// Serve frontend in production-like environments
const possibleDistPaths = [
  path.join(process.cwd(), "dist"),
  path.join(process.cwd(), "..", "..", "dist"),
  path.join(process.cwd(), "..", "brightline-dental", "dist"),
  path.join(process.cwd(), "artifacts", "brightline-dental", "dist"),
];

let distPath = "";
for (const p of possibleDistPaths) {
  if (fs.existsSync(p) && fs.existsSync(path.join(p, "index.html"))) {
    distPath = p;
    break;
  }
}

if (distPath) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

export default app;
