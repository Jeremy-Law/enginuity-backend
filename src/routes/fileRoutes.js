const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");


router.get("/files", fileController.listFiles);
router.post("/files", fileController.uploadFile);
router.get("/files/:key", fileController.getFile);
router.put("/files/:key", fileController.replaceFile);
router.delete("/files/:key", fileController.deleteFile);


router.get("/files/search", fileController.searchFiles);
router.get("/files/recent", fileController.getRecentFiles);


router.post("/files/:key/comments", fileController.addComment);
router.put("/files/:key/comments/:commentId", fileController.editComment);
router.delete("/files/:key/comments/:commentId", fileController.deleteComment);


router.post("/files/:key/questions", fileController.addQuestion);
router.put("/files/:key/questions/:questionId", fileController.editQuestion);
router.delete("/files/:key/questions/:questionId", fileController.deleteQuestion);
router.post("/files/:key/questions/:questionId/answer", fileController.answerQuestion);

module.exports = router;
