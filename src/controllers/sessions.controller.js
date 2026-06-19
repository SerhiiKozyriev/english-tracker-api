const sessionService = require('../services/sessions.service');

exports.getSessions = async (req, res, next) => {
  try {
    const { search } = req.query;
    const sessions = await sessionService.getAllSessions(search);
    res.json(sessions);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

exports.createSession = async (req, res, next) => {
  try {
    const savedSession = await sessionService.createNewSession(req.body);
    res.status(201).json(savedSession);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

exports.deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    await sessionService.removeSession(id);
    res.json({ message: 'Session deleted successfully', id });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};
