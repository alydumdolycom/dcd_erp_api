// src/config/db.js
import pg from "pg";
import dotenv from "dotenv";

// Load .env from project root automatically
dotenv.config();

const { Pool } = pg;

// Validate required env vars
const requiredEnv = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
  }
});

// Create connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
});

// Optional: test connection when server starts
pool.connect()
  .then(() => console.log("📦 PostgreSQL connected"))
  .catch(err => console.error("❌ PostgreSQL connection error:", err));

export default pool;
