const express = require("express");
const pool = require("./config/db");
const userRoutes = require("./routes/userRoutes");
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


// User routes
app.use("/users", userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});



// S3 helpers
const { uploadFile, listFiles } = require("./s3");

app.get("/files", async (req, res) => {
  try {
    const files = await listFiles();
    res.json({ files });
  } catch (err) {
    console.error("S3 list error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/upload-test", async (req, res) => {
  try {
    const result = await uploadFile("hello.txt", "Hello from Enginuity backend 🚀");
    res.json({ url: result.Location });
  } catch (err) {
    console.error("S3 upload error:", err);
    res.status(500).json({ error: err.message });
  }
});
