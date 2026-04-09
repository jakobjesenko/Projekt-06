import express from "express";
import session from "express-session";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import hbs from "hbs";
import multer from "multer"; // <-- DODAJ
import hbsRouter from "./hbs/routes/hbs.js";
import apiRouter from "./api/routes/api.js";
import "./api/models/db.js";

const port = process.env.PORT || 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Multer za FormData (brez datotek)
const upload = multer();
app.use(upload.none()); // <-- POMEMBNO: parsira multipart/form-data

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

// View engine setup
app.set("views", join(__dirname, "hbs", "views"));
app.set("view engine", "hbs");

hbs.registerPartials(join(__dirname, "hbs", "views", "partials"));

hbs.registerHelper("eq", function(a, b) {
    return a === b;
});

hbs.registerHelper("json", function(context) {
    return JSON.stringify(context);
});

// Routes
app.use("/", hbsRouter);
app.use("/api", apiRouter);

// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});