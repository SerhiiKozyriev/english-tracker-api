const Datastore = require('nedb-promises');
const db = Datastore.create({ filename: 'sessions.db', autoload: true });

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const createClientError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

exports.getAllSessions = async (search) => {
  let filter = {};

  if (search) {
    if (typeof search !== 'string') {
      throw createClientError('Search query must be a string', 400);
    }
    const escapedSearch = escapeRegExp(search);
    const searchRegex = new RegExp(escapedSearch, 'i');
    filter = {
      $or: [{ notes: searchRegex }, { 'topics.desc': searchRegex }]
    };
  }

  try {
    return await db.find(filter).sort({ date: -1 });
  } catch (error) {
    throw new Error(`Database error while fetching sessions: ${error.message}`);
  }
};

exports.createNewSession = async (sessionData) => {
  if (!sessionData) {
    throw createClientError('Session data is required', 400);
  }

  const { date, duration, notes, topics } = sessionData;

  if (!date || typeof date !== 'string' || !date.trim()) {
    throw createClientError('Date is required and must be a non-empty string', 400);
  }

  const dateStr = date.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw createClientError('Date must be in YYYY-MM-DD format', 400);
  }

  if (duration === undefined || duration === null) {
    throw createClientError('Duration is required', 400);
  }
  if (typeof duration !== 'number' || duration <= 0) {
    throw createClientError('Duration must be a positive number', 400);
  }

  if (topics && !Array.isArray(topics)) {
    throw createClientError('Topics must be an array', 400);
  }

  const escapedDate = escapeRegExp(dateStr);
  const dateRegex = new RegExp(`^${escapedDate}`);
  
  let existingSession;
  try {
    existingSession = await db.findOne({ date: dateRegex });
  } catch (error) {
    throw new Error(`Database error checking existing session: ${error.message}`);
  }

  if (existingSession) {
    throw createClientError('Session is already in use', 400);
  }

  const newSession = {
    date: dateStr,
    duration,
    notes: typeof notes === 'string' ? notes.trim() : '',
    topics: Array.isArray(topics) ? topics : [],
    createdAt: new Date()
  };

  try {
    return await db.insert(newSession);
  } catch (error) {
    throw new Error(`Database error inserting session: ${error.message}`);
  }
};

exports.removeSession = async (id) => {
  if (!id || typeof id !== 'string') {
    throw createClientError('Session ID must be a non-empty string', 400);
  }

  let numRemoved;
  try {
    numRemoved = await db.remove({ _id: id }, {});
  } catch (error) {
    throw new Error(`Database error deleting session: ${error.message}`);
  }

  if (numRemoved === 0) {
    throw createClientError('Session not found', 404);
  }

  return true;
};
