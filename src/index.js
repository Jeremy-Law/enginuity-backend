const express = require("express");
const pool = require("../config/db");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const projectRoutes = require("./routes/projectsRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/", userRoutes);      // handles /users and /auth/login
app.use("/files", fileRoutes); // handles /files, /files/:key, etc.
app.use("/projects", projectRoutes); // handles /projects, /projects/:id, etc.

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
