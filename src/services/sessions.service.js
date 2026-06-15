const Datastore = require('nedb-promises');
const db = Datastore.create({ filename: 'sessions.db', autoload: true });

exports.getAllSessions = async (search) => {
  let filter = {};

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter = {
      $or: [{ notes: searchRegex }, { 'topics.desc': searchRegex }]
    };
  }

  return await db.find(filter).sort({ date: -1 });
};

exports.createNewSession = async (sessionData) => {
  const { date, duration, notes, topics } = sessionData;

  const dateRegex = new RegExp(`^${date}`);
  const existingSession = await db.findOne({ date: dateRegex });

  if (existingSession) {
    throw new Error('Session is already in use');
  }

  const newSession = {
    date,
    duration,
    notes,
    topics,
    createdAt: new Date()
  };

  return await db.insert(newSession);
};

exports.removeSession = async (id) => {
  const numRemoved = await db.remove({ _id: id }, {});

  if (numRemoved === 0) {
    throw new Error('Session not found');
  }

  return true;
};
