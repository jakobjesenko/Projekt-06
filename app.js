import express from "express";
import session from "express-session";
import http from "node:http";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import hbsRouter from "./hbs/routes/hbs.js";
import apiRouter from "./api/routes/api.js";
import "./api/models/db.js";
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

app.use(session({
  secret: process.env.SESSION_SECRET || 'srecajmose-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  const token = socket.handshake.auth.token;

  if (!token) {
    console.log('No JWT token, disconnecting:', socket.id);
    socket.disconnect();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.username = decoded.username;
    console.log('User authenticated:', decoded.username);
  } catch (error) {
    console.log('Invalid JWT token, disconnecting:', socket.id);
    socket.disconnect();
    return;
  }

  socket.on('joinMeetingRoom', (meetingId) => {
    socket.join(meetingId);
    console.log(`User ${socket.id} joined room for meeting ${meetingId}`);
  });

  socket.on('leaveMeetingRoom', (meetingId) => {
    socket.leave(meetingId);
    console.log(`User ${socket.id} left room for meeting ${meetingId}`);
  });

  socket.on('joinConcertRoom', (meetingId) => {
    socket.join(meetingId);
    console.log(`User ${socket.id} joined room (legacy event) for meeting ${meetingId}`);
  });

  socket.on('leaveConcertRoom', (meetingId) => {
    socket.leave(meetingId);
    console.log(`User ${socket.id} left room (legacy event) for meeting ${meetingId}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: false,
  helpers: {
    eq: (a, b) => a === b,
    json: (context) => JSON.stringify(context),
    formatDate: (date) => {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    },
    getAge: (birthday) => {
      if (!birthday) return '?';
      const today = new Date();
      const birthDate = new Date(birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
  }
}));

app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'hbs', 'views'));

app.use("/", hbsRouter);
app.use("/api", apiRouter);

const swaggerDocument = swaggerJsDoc({
  definition: {
    openapi: '3.1.1',
    info: {
      title: 'Koncerti.net API',
      version: '1.0.0',
      description: 'REST API za spletno aplikacijo Koncerti.net',
    },
    servers: [
      { url: 'http://localhost:3000/api', description: 'DEV' },
      { url: 'https://srecajmose.live/api', description: 'PROD' },
    ],
    components: {
      schemas: {
        SuccessMessage: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', description: 'Success message', example: 'Operation completed successfully' },
          },
          required: ['success', 'message'],
        },
        ErrorMessage: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', description: 'Description of the error', example: 'Error processing the request' },
          },
          required: ['success', 'message'],
        },
      },
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Vnesi samo token (brez "Bearer ")',
        },
      },
    },
  },
  apis: ['./api/models/*.js', './api/controllers/*.js', './api/routes/*.js'],
});

app.get('/api/swagger.json', (req, res) => res.status(200).json(swaggerDocument));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export async function initDB() {
  await import("./api/models/db.js");
}

export { app, server };