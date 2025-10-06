const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');


router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.editProject);
router.delete('/:id', projectController.deleteProject);

router.get('/:id/users', projectController.getProjectUsers);
router.post('/:id/users', projectController.addUserToProject);
router.delete('/:id/users/:userId', projectController.removeUserFromProject);

module.exports = router;