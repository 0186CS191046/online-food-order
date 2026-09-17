
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import config from "./config/index.js";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import { staticMessages, STATUS_CODE } from "./utils/constant.js";
import { errorResponse } from "./utils/response.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // (Postman, server-to-server requests, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

async function startServer() {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server is listening on port: ${config.port}`);
    });

    app.get("/health", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Everything is OK!",
      });
    });

    app.use(config.api_prefix, routes);
    
    app.use((req, res) => {
      return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.ROUTE_NOT_FOUND))
    })
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

