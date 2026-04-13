import express from "express";
import session from "express-session";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import hbsRouter from "./hbs/routes/hbs.js";
import apiRouter from "./api/routes/api.js";
import "./api/models/db.js";

const port = process.env.PORT || 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Session middleware
app.use(session({
    secret: 'srecajmose-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

// ========== HANDLEBARS SETUP ==========
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

// Routes
app.use("/", hbsRouter);
app.use("/api", apiRouter);

// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

// Swagger Documentation
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
      { url: 'https://dodaj/api', description: 'PROD' },
    ],
    components: {
      schemas: {
        SuccessMessage: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully',
            },
          },
          required: ['success', 'message'],
        },
        ErrorMessage: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Description of the error',
              example: 'Error processing the request',
            },
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

// JSON output
app.get('/api/swagger.json', (req, res) => res.status(200).json(swaggerDocument));

// UI output
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});