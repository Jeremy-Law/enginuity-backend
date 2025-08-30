const express = require("express");
const pool = require("./db");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Root test
app.get("/", (req, res) => {
  res.send("Enginuity backend running 🚀");
});


// DB test route
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ serverTime: result.rows[0].now });
  } catch (err) {
    console.error("DB connection error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Fetch all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows); // Return array directly
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add a new user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting user:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
