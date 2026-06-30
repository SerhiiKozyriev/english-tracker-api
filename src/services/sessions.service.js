const prisma = require('../prisma');
const { NotFoundError, ConflictError } = require('../utils/errors');

const getAll = async (search) => {
  return await prisma.session.findMany({
    where: search ? {
      OR: [
        { notes: { contains: search, mode: 'insensitive' } },
        { topics: { some: { desc: { contains: search, mode: 'insensitive' } } } }
      ]
    } : undefined,
    include: { topics: true },
    orderBy: { date: 'desc' }
  });
};

const create = async (sessionData) => {
  const { topics, ...fields } = sessionData;

  try {
    return await prisma.session.create({
      data: {
        ...fields,
        topics: {
          create: topics.map(t => ({
            category: t.category,
            desc: t.desc
          }))
        }
      },
      include: { topics: true }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new ConflictError('Session is already in use');
    }
    throw error;
  }
};

const update = async (id, sessionData) => {
  const { topics, ...updateFields } = sessionData;

  if (topics !== undefined) {
    updateFields.topics = {
      deleteMany: {},
      create: topics.map(t => ({
        category: t.category,
        desc: t.desc
      }))
    };
  }

  try {
    return await prisma.session.update({
      where: { id },
      data: updateFields,
      include: { topics: true }
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new NotFoundError('Session not found');
    }
    if (error.code === 'P2002') {
      throw new ConflictError('Session is already in use');
    }
    throw error;
  }
};

const remove = async (id) => {
  try {
    await prisma.session.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new NotFoundError('Session not found');
    }
    throw error;
  }
};

module.exports = { getAll, create, update, delete: remove };
