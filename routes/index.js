const express = require('express');
// Create a router to define routes
const router = express.Router();

// Import the router for handling logic of routes
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

// Define status endpoint
router.get('/status', AppController.getStatus);

// Define stats endpoint
router.get('/stats', AppController.getStats);

// Define users endpoint
router.post('/users', UsersController.postNew);

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
// router.get('/users/me'. UsersController.getMe);

// export the router
module.exports = router;
