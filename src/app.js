const express = require('express');
const cors = require('cors');
const { ZodError } = require('zod');
const { AppError } = require('./utils/errors');
const sessionRoutes = require('./routes/sessions.routes');
const vocabularyRoutes = require('./routes/vocabulary.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/sessions', sessionRoutes);
app.use('/api/vocabulary', vocabularyRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON payload' });
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(e => {
      const fieldPath = e.path.slice(1).join('.');
      return {
        field: fieldPath || e.path[0] || 'root',
        message: e.message
      };
    });
    return res.status(400).json({
      error: err.errors[0]?.message || 'Validation Error',
      errors: formattedErrors
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const status = err.statusCode || err.status || 500;

  res.status(status).json({
    error: isProduction && status === 500 ? 'Internal Server Error' : err.message || 'Internal Server Error'
  });
});

module.exports = app;
