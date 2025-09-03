const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.get('/listAllFiles', fileController.listAllFiles);

router.get('/listProjectFiles/:id', fileController.listProjectFiles);

router.get('/searchFiles', fileController.searhFiles);

router.post('/uploadFile')

//Comment
//Edit
//Replace
//Ask