const vocabularyService = require('../services/vocabulary.service');

const getWords = async (req, res, next) => {
    try {
        const {status, search} = req.query;
        const words = await vocabularyService.getWords(status, search);
        res.json(words);
    } catch (error) {
        next(error);
    }
};

const createWord = async (req, res, next) => {
    try {

        const newWord = await vocabularyService.addWord(req.body);
        res.status(201).json(newWord);
    } catch (error) {
        next(error);
    }
};

const updateWord = async (req, res, next) => {
    try {
        const {id} = req.params;
        await vocabularyService.updateWord(id, req.body);
        res.json({success: true, message: 'Status updated'});
    } catch (error) {
        next(error);
    }
};

deleteWord = async (req, res, next) => {
    try {
        const {id} = req.params;
        await vocabularyService.deleteWord(id);
        res.json({message: 'Word deleted successfully', id});
    } catch (error) {
        if (error.message === 'Word not found') {
            return res.status(404).json({error: error.message});
        }
        next(error);
    }
};
module.exports = {getWords, createWord, updateWord, deleteWord};
