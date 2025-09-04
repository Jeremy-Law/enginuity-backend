const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");

// Upload file
router.post("/uploadFile", async (req, res) => {
  try {
    const { key, content } = req.body;
    const result = await fileController.uploadFile(key, content);
    res.json(result);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// List all files (dont care about project)
router.get("/listAllFiles", async (req, res) => {
  try {
    const files = await fileController.listFiles();
    res.json(files);
  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete file
router.delete("/deleteFile", async (req, res) => {
  try {
    const { key } = req.body;
    const result = await fileController.deleteFile(key);
    res.json(result);
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get file
router.get("/getFile", async (req, res) => {
  try {
    const { key } = req.query;
    const data = await fileController.getFile(key);
    res.send(data); // data is a Buffer
  } catch (err) {
    console.error("Get file error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Search files
router.get("/searchFiles", async (req, res) => {
  try {
    const { prefix } = req.query;
    const files = await fileController.searchFiles(prefix);
    res.json(files);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Replace file
router.post("/replaceFile", async (req, res) => {
  try {
    const { key, newContent } = req.body;
    const result = await fileController.replaceFile(key, newContent);
    res.json(result);
  } catch (err) {
    console.error("Replace error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Comments
router.post("/addComment", async (req, res) => {
  try {
    const { key, comment } = req.body;
    const result = await fileController.addComment(key, comment);
    res.json(result);
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/editComment", async (req, res) => {
  try {
    const { key, newComment } = req.body;
    const result = await fileController.editComment(key, newComment);
    res.json(result);
  } catch (err) {
    console.error("Edit comment error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteComment", async (req, res) => {
  try {
    const { key } = req.body;
    const result = await fileController.deleteComment(key);
    res.json(result);
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Questions
router.post("/addQuestion", async (req, res) => {
  try {
    const { key, question } = req.body;
    const result = await fileController.addQuestion(key, question);
    res.json(result);
  } catch (err) {
    console.error("Add question error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/answerQuestion", async (req, res) => {
  try {
    const { key, answer } = req.body;
    const result = await fileController.answerQuestion(key, answer);
    res.json(result);
  } catch (err) {
    console.error("Answer question error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/editQuestion", async (req, res) => {
  try {
    const { key, newContent } = req.body;
    const result = await fileController.editQuestion(key, newContent);
    res.json(result);
  } catch (err) {
    console.error("Edit question error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/deleteQuestion", async (req, res) => {
  try {
    const { key } = req.body;
    const result = await fileController.deleteQuestion(key);
    res.json(result);
  } catch (err) {
    console.error("Delete question error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
