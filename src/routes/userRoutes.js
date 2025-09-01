const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', userController.getAllUsers);

router.post('/registerUser', userController.createUser);

module.exports = router;
