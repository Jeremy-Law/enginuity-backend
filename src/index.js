const express = require("express");
const pool = require("../config/db");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const projectRoutes = require("./routes/projectsRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


// User routes
app.use("/users", userRoutes);

app.use("/files", fileRoutes);

app.use("/projects", projectRoutes);

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});



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
