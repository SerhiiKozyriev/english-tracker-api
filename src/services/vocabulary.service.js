const prisma = require('../prisma');
const { NotFoundError } = require('../utils/errors');

const getAll = async (search, status) => {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { word: { contains: search, mode: 'insensitive' } },
      { translation: { contains: search, mode: 'insensitive' } }
    ];
  }

  return await prisma.word.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
};

const create = async (data) => {
  const { word, translation, status, example } = data;

  const newCard = {
    word: word.trim(),
    translation: translation.trim(),
    status: status || 'learning',
    example: example || '',
  };

  return await prisma.word.create({ data: newCard });
};

const update = async (id, body) => {
  const { id: _, createdAt, ...fieldsToUpdate } = body;

  try {
    await prisma.word.update({
      where: { id },
      data: fieldsToUpdate
    });
    return 1;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new NotFoundError('Word not found');
    }
    throw error;
  }
};

const remove = async (id) => {
  try {
    await prisma.word.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new NotFoundError('Word not found');
    }
    throw error;
  }
};

const getStats = async () => {
  const learned = await prisma.word.count({ where: { status: 'learned' } });
  const learning = await prisma.word.count({ where: { status: 'learning' } });
  return { learned, learning, total: learned + learning };
};

module.exports = { getAll, create, update, delete: remove, getStats };
