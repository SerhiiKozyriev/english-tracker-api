const Datastore = require('nedb-promises');
const db = Datastore.create({filename: 'vocabulary.db', autoload: true});

const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const createClientError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const getWords = async (search, status) => {
    if (search && typeof search !== 'string') {
        throw createClientError('Search must be a string', 400);
    }
    if (status && !['learning', 'learned'].includes(status)) {
        throw createClientError('Invalid status', 400);
    }

    const query = {};

    if (status) {
        query.status = status;
    }

    if (search) {
        const escapedSearch = escapeRegExp(search);
        const searchRegex = new RegExp(escapedSearch, 'i');
        query.$or = [{ word: searchRegex }, { translation: searchRegex }];
    }

    try {
        return await db.find(query).sort({ createdAt: -1 });
    } catch (error) {
        throw new Error(`Database error while fetching words: ${error.message}`);
    }
};

const addWord = async (data) => {
    if (!data) {
        throw createClientError('Word data is required', 400);
    }
    const { word, translation, status } = data;
    if (!word || typeof word !== 'string' || !word.trim()) {
        throw createClientError('Word is required and must be a non-empty string', 400);
    }
    if (!translation || typeof translation !== 'string' || !translation.trim()) {
        throw createClientError('Translation is required and must be a non-empty string', 400);
    }

    const newCard = {
        ...data,
        word: word.trim(),
        translation: translation.trim(),
        status: typeof status === 'string' ? status.trim() : 'learning',
        createdAt: new Date(),
    };

    try {
        return await db.insert(newCard);
    } catch (error) {
        throw new Error(`Database error while adding word: ${error.message}`);
    }
};

const updateWord = async (id, body) => {
    if (!id || typeof id !== 'string') {
        throw createClientError('Word ID must be a non-empty string', 400);
    }
    if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
        throw createClientError('Update payload must be a non-empty object', 400);
    }

    let numUpdated;
    try {
        numUpdated = await db.update({_id: id}, {$set: {...body}});
    } catch (error) {
        throw new Error(`Database error while updating word: ${error.message}`);
    }

    if (numUpdated === 0) {
        throw createClientError('Word not found', 404);
    }
    return numUpdated;
};

const deleteWord = async (id) => {
    if (!id || typeof id !== 'string') {
        throw createClientError('Word ID must be a non-empty string', 400);
    }

    let numRemoved;
    try {
        numRemoved = await db.remove({_id: id}, {});
    } catch (error) {
        throw new Error(`Database error while deleting word: ${error.message}`);
    }

    if (numRemoved === 0) {
        throw createClientError('Word not found', 404);
    }

    return true;
}

const getWordsStats = async () => {
    const learned = await db.count({ status: 'learned' });
    const learning = await db.count({ status: 'learning' });
    return { learned, learning, total: learned + learning };
};

module.exports = {getWords, addWord, updateWord, deleteWord, getWordsStats};
