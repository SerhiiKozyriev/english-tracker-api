const Datastore = require('nedb-promises');
const db = Datastore.create({ filename: 'database.db', autoload: true });

const getWords = async (status, search) => {
  let query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [{ word: searchRegex }, { translation: searchRegex }];
  }

  return await db.find(query).sort({ createdAt: -1 });
};

const addWord = async (data) => {
  const newCard = {
    ...data,
    status: 'learning',
    createdAt: new Date(),
  };

  return await db.insert(newCard);
};

const updateStatus = async (id, status) => {
  const numUpdated = await db.update({ _id: id }, { $set: { status } });
  if (numUpdated === 0) {
    throw new Error('Word not found');
  }
};

module.exports = { getWords, addWord, updateStatus };
