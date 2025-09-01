const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', userController.getAllUsers);

router.post('/create', userController.createUser);

module.exports = router;
