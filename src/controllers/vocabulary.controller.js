const vocabularyService = require('../services/vocabulary.service');

const getAll = async (req, res) => {
  const { search, status } = req.query;
  const words = await vocabularyService.getAll(search, status);
  res.status(200).json(words);
};

const getStats = async (req, res) => {
  const stats = await vocabularyService.getStats();
  res.status(200).json(stats);
};

const create = async (req, res) => {
  const newWord = await vocabularyService.create(req.body);
  res.status(201).json(newWord);
};

const update = async (req, res) => {
  const { id } = req.params;
  await vocabularyService.update(id, req.body);
  res.status(200).json({ success: true, message: 'Status updated' });
};

const remove = async (req, res) => {
  const { id } = req.params;
  await vocabularyService.delete(id);
  res.status(200).json({ message: 'Word deleted successfully', id });
};

module.exports = { getAll, create, update, delete: remove, getStats };
