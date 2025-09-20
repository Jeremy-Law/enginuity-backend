const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');


router.get('/projects', projectController.getAllProjects);
router.post('/projects', projectController.createProject);
router.get('/projects/:id', projectController.getProject);
router.put('/projects/:id', projectController.editProject);
router.delete('/projects/:id', projectController.deleteProject);


router.post('/projects/:id/users', projectController.addUserToProject);
router.delete('/projects/:id/users/:userId', projectController.removeUserFromProject);

module.exports = router;