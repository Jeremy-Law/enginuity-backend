const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/getAllProjects', projectController.getAllProjects);

router.post('/createProject', projectController.createProject);

router.delete('/deleteProject', projectController.deleteProject);

router.get('/getProject', projectController.getProject);

router.put('/editProject', projectController.editProject);

router.post('/addUserToProject', projectController.addUserToProject);

router.post('/removeUserFromProject', projectController.removeUserFromProject);