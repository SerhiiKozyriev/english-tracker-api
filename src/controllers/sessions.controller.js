const sessionService = require('../services/sessions.service');

const getAll = async (req, res) => {
  const { search } = req.query;
  const sessions = await sessionService.getAll(search);
  res.status(200).json(sessions);
};

const create = async (req, res) => {
  const savedSession = await sessionService.create(req.body);
  res.status(201).json(savedSession);
};

const update = async (req, res) => {
  const { id } = req.params;
  const updatedSession = await sessionService.update(id, req.body);
  res.status(200).json(updatedSession);
};

const remove = async (req, res) => {
  const { id } = req.params;
  await sessionService.delete(id);
  res.status(200).json({ message: 'Session deleted successfully', id });
};

const getStats = async (req, res) => {
  const stats = await sessionService.getStats();
  res.status(200).json(stats);
};

module.exports = { getAll, create, update, delete: remove, getStats };

