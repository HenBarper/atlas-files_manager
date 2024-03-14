const express = require('express');
// Create a router to define routes
const router = express.Router();

// Import the router for handling logic of routes
const AppController = require('../controllers/AppController');

// Define status endpoint
router.get('/status', AppController.getStatus);

// Define stats endpoint
router.get('/stats', AppController.getStats);

// export the router
module.exports = router;
