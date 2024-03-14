const express = require('express');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// Load routes from index.js
app.use(express.json());
// Adding routes
app.use(routes);

// Start the server to listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
