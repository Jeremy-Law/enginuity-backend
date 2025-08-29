// index.js
const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// Create a Postgres connection pool using env vars
const pool = new Pool({
  host: process.env.POSTGRES_HOST,      // should be "db" from docker-compose
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT || 5432,
});

app.get("/", (req, res) => {
  res.send("Enginuity backend running 🚀");
});

// Quick DB test route
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ serverTime: result.rows[0].now });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
