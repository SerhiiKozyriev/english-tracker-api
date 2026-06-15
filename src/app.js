const express = require('express');
const cors = require('cors');
const sessionRoutes = require('./routes/sessions.routes');
const vocabularyRoutes = require('./routes/vocabulary.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/sessions', sessionRoutes);
app.use('/api/vocabulary', vocabularyRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
