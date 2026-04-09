// api/models/db.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const dbURI = process.env.MONGODB_ATLAS_URI || "mongodb://127.0.0.1:27017/tpo";

console.log("📡 Connecting to database...");

mongoose.connect(dbURI)
  .then(() => console.log("✅ Connected to database!"))
  .catch(err => console.error("❌ Connection error:", err.message));

mongoose.connection.on("error", (err) =>
  console.log(`Mongoose connection error: ${err.message}.`)
);

mongoose.connection.on("disconnected", () =>
  console.log("Mongoose disconnected")
);

// Graceful shutdown
const gracefulShutdown = async (msg, callback) => {
  await mongoose.connection.close();
  console.log(`Mongoose disconnected through ${msg}.`);
  callback();
};

process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart", () => process.kill(process.pid, "SIGUSR2"));
});

process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => process.exit(0));
});

process.on("SIGTERM", () => {
  gracefulShutdown("Cloud-based app shutdown", () => process.exit(0));
});

// Import modelov
import "./User.js";
import "./Meeting.js";
import "./ConfirmedMeeting.js";
import "./Rating.js";