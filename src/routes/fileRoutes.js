const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");


router.get("/", fileController.listFiles);
router.post("/", fileController.uploadFile);
router.get("/:key", fileController.getFile);
router.put("/:key", fileController.replaceFile);
router.delete("/:key", fileController.deleteFile);


router.get("/search", fileController.searchFiles);
router.get("/recent", fileController.getRecentFiles);


router.post("/files/:key/comments", fileController.addComment);
router.put("/files/:key/comments/:commentId", fileController.editComment);
router.delete("/files/:key/comments/:commentId", fileController.deleteComment);


router.post("/files/:key/questions", fileController.addQuestion);
router.put("/files/:key/questions/:questionId", fileController.editQuestion);
router.delete("/files/:key/questions/:questionId", fileController.deleteQuestion);
router.post("/files/:key/questions/:questionId/answer", fileController.answerQuestion);

module.exports = router;
