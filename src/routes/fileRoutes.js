const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.post('/uploadFile', fileController.uploadFile);

router.get('/listAllFiles', fileController.listFiles);

router.delete('/deleteFile', fileController.deleteFile);

router.get('/getFile', fileController.getFile);

router.get('/searchFiles', fileController.searchFiles);

router.post('/replaceFile', fileController.replaceFile);


router.post('/addComment', fileController.addComment);

router.put('/editComment', fileController.editComment);

router.delete('/deleteComment', fileController.deleteComment);

router.post('/addQuestion', fileController.addQuestion);

router.post('/answerQuestion', fileController.answerQuestion);

router.post('/editQuestion', fileController.editQuestion);

router.post('/deleteQuestion', fileController.deleteQuestion);