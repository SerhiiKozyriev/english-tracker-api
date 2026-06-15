const vocabularyService = require('../services/vocabulary.service');

const getAll = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const words = await vocabularyService.getWords(status, search);
    res.json(words);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {

    const newWord = await vocabularyService.addWord(req.body);
    res.status(201).json(newWord);
  } catch (error) {
    next(error);
  }
};

const toggleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await vocabularyService.updateStatus(id, status);
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create, toggleStatus };
