import express from "express";
import session from "express-session";
import http from "node:http";
import { existsSync } from "node:fs";
import { verifyToken } from "./api/utils/jwt.js";
import dotenv from "dotenv";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Server } from "socket.io";

import "./api/models/db.js";
import apiRouter from "./api/routes/api.js";

dotenv.config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:3000",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || "srecajmose-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  const token = socket.handshake.auth?.token;

  if (!token) {
    console.log("No JWT token, disconnecting:", socket.id);
    socket.disconnect();
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    console.log("Invalid JWT token, disconnecting:", socket.id);
    socket.disconnect();
    return;
  }

  socket.userId = decoded.id;
  socket.username = decoded.username;
  console.log("User authenticated:", decoded.username);

  socket.on("joinMeetingRoom", (meetingId) => {
    socket.join(meetingId);
    console.log(`User ${socket.id} joined room for meeting ${meetingId}`);
  });

  socket.on("leaveMeetingRoom", (meetingId) => {
    socket.leave(meetingId);
    console.log(`User ${socket.id} left room for meeting ${meetingId}`);
  });

  socket.on("joinConcertRoom", (meetingId) => {
    socket.join(meetingId);
    console.log(`User ${socket.id} joined room (legacy event) for meeting ${meetingId}`);
  });

  socket.on("leaveConcertRoom", (meetingId) => {
    socket.leave(meetingId);
    console.log(`User ${socket.id} left room (legacy event) for meeting ${meetingId}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

const swaggerDocument = swaggerJsDoc({
  definition: {
    openapi: "3.1.1",
    info: {
      title: "Srecajmose API",
      version: "1.0.0",
      description: "REST API za spletno aplikacijo Srecajmose",
    },
    servers: [
      { url: 'http://localhost:3000/api', description: 'DEV' },
      { url: 'https://srecajmose.live/api', description: 'PROD' },
    ],
    components: {
      schemas: {
        SuccessMessage: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: {
              type: "string",
              description: "Success message",
              example: "Operation completed successfully",
            },
          },
          required: ["success", "message"],
        },
        ErrorMessage: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: {
              type: "string",
              description: "Description of the error",
              example: "Error processing the request",
            },
          },
          required: ["success", "message"],
        },
      },
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: 'Vnesi samo token (brez "Bearer ")',
        },
      },
    },
  },
  apis: ["./api/models/*.js", "./api/controllers/*.js", "./api/routes/*.js"],
});

app.use("/api", apiRouter);

app.get("/api/swagger.json", (req, res) => {
  res.status(200).json(swaggerDocument);
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const angularPathCandidates = [
  join(__dirname, "srecajmo-se", "build", "browser"),
  join(__dirname, "srecajmo-se", "dist", "srecajmo-se", "browser"),
];

const angularDistPath = angularPathCandidates.find((path) => existsSync(join(path, "index.html")));

if (angularDistPath) {
  app.use(express.static(angularDistPath, {
    index: false
  }));
}

app.get(/^\/(?!api).*/, (req, res) => {
  if (!angularDistPath) {
    return res.status(500).send("Angular build not found. Run 'ng build --output-path=build' in src/srecajmo-se.");
  }

  res.sendFile(join(angularDistPath, "index.html"));
});

export async function initDB() {
  await import("./api/models/db.js");
}

export { app, server };