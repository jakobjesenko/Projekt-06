// api/models/db.js
import dotenv from "dotenv";
// Don't load .env during tests to avoid overriding test-controlled env vars
if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

import mongoose from "mongoose";

// trenutno se veze na lokalno bazo, ce spremenis  NODE_ENV=prduciton se veze na produkcijsko bazo
let dbURI = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI || "mongodb://127.0.0.1:27017/tpo";

if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGODB_ATLAS_URI;
} else if (process.env.NODE_ENV === 'docker') {
  dbURI =
    process.env.MONGODB_DOCKER_URI ||
    'mongodb://admin:password@mongodb:27017/srecajmose?authSource=admin'; // notr gre se geslo tm med admin: in @
} else if (process.env.MONGODB_URI) {
  dbURI = process.env.MONGODB_URI;
}

console.log("📡 Connecting to database...");

// naredi pool povezav za boljso zmogljivost tista fora s predavanj glej skripto poglavje 7 cist na koncu
const options = {
  maxPoolSize: 20,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  family: 4,
};

mongoose.connect(dbURI, options);

// asynhrono da preveri ce se je vzpostavil pool
mongoose.connection.on('connected', async () => {
  console.log(`Mongoose connected to ${dbURI.replace(/:.+?@/, ':*****@')}.`);

  // Ping baze šele, ko db obstaja
  try {
    await mongoose.connection.db.admin().ping();
    console.log('Ping uspešen, pool dela!');
  } catch (err) {
    console.error('Ping ni uspel:', err);
  }
});

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
import "./users.js";
import "./meetings.js";
import "./ratings.js";
import "./messages.js";
import "./contacts.js";
import "./analytics.js";
import "./reports.js"