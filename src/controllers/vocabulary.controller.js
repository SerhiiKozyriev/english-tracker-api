const vocabularyService = require('../services/vocabulary.service');

const getAll = async (req, res, next) => {
    try {
        const {search, status} = req.query;
        const words = await vocabularyService.getAll(search, status);
        res.json(words);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({error: error.message});
        }
        next(error);
    }
};

const getStats = async (req, res, next) => {
    try {
        const stats = await vocabularyService.getStats();
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const newWord = await vocabularyService.create(req.body);
        res.status(201).json(newWord);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({error: error.message});
        }
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const {id} = req.params;
        await vocabularyService.update(id, req.body);
        res.json({success: true, message: 'Status updated'});
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({error: error.message});
        }
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const {id} = req.params;
        await vocabularyService.delete(id);
        res.json({message: 'Word deleted successfully', id});
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({error: error.message});
        }
        next(error);
    }
};
module.exports = {getAll, create, update, delete: remove, getStats};
