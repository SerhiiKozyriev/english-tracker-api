const express = require('express');
const cors = require('cors');
const sessionRoutes = require('./routes/sessions.routes');
const vocabularyRoutes = require('./routes/vocabulary.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Handle malformed JSON request bodies
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON payload' });
  }
  next(err);
});

app.use('/api/sessions', sessionRoutes);
app.use('/api/vocabulary', vocabularyRoutes);

// Catch-all route for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
