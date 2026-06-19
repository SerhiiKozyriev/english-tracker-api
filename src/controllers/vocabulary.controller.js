const vocabularyService = require('../services/vocabulary.service');

const getWords = async (req, res, next) => {
    try {
        const {search, status} = req.query;
        const words = await vocabularyService.getWords(search, status);
        res.json(words);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({error: error.message});
        }
        next(error);
    }
};

const getWordsStats = async (req, res, next) => {
    try {
        const stats = await vocabularyService.getWordsStats();
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

const createWord = async (req, res, next) => {
    try {
        const newWord = await vocabularyService.addWord(req.body);
        res.status(201).json(newWord);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({error: error.message});
        }
        next(error);
    }
};

const updateWord = async (req, res, next) => {
    try {
        const {id} = req.params;
        await vocabularyService.updateWord(id, req.body);
        res.json({success: true, message: 'Status updated'});
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({error: error.message});
        }
        next(error);
    }
};

const deleteWord = async (req, res, next) => {
    try {
        const {id} = req.params;
        await vocabularyService.deleteWord(id);
        res.json({message: 'Word deleted successfully', id});
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({error: error.message});
        }
        next(error);
    }
};
module.exports = {getWords, createWord, updateWord, deleteWord, getWordsStats};
