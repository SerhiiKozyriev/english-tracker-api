const Datastore = require('nedb-promises');
const db = Datastore.create({filename: 'vocabulary.db', autoload: true});

const getWords = async (status, search) => {
    let query = {};

    if (status && status !== 'all') {
        query.status = status;
    }

    if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [{word: searchRegex}, {translation: searchRegex}, {status: searchRegex}];
    }

    return await db.find(query).sort({createdAt: -1});
};

const addWord = async (data) => {
    const newCard = {
        ...data,
        status: 'learning',
        createdAt: new Date(),
    };

    return await db.insert(newCard);
};

const updateWord = async (id, body) => {
    return await db.update({_id: id}, {$set: {...body}});
};

const deleteWord = async (id) => {
    const numRemoved = await db.remove({_id: id}, {});

    if (numRemoved === 0) {
        throw new Error('Word not found');
    }

    return true;
}
module.exports = {getWords, addWord, updateWord, deleteWord};
