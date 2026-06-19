const sessionService = require('../services/sessions.service');

exports.getAll = async (req, res, next) => {
  try {
    const { search } = req.query;
    const sessions = await sessionService.getAll(search);
    res.json(sessions);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const savedSession = await sessionService.create(req.body);
    res.status(201).json(savedSession);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await sessionService.delete(id);
    res.json({ message: 'Session deleted successfully', id });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};
