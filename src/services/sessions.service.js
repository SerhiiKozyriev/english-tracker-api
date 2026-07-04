const prisma = require('../prisma');
const { NotFoundError, ConflictError } = require('../utils/errors');

const getAll = async (search) => {
  return prisma.session.findMany({
    where: search ? {
      OR: [
        {notes: {contains: search, mode: 'insensitive'}},
        {topics: {some: {desc: {contains: search, mode: 'insensitive'}}}},
        {topics: {some: {category: {display_name: {contains: search, mode: 'insensitive'}}}}},
        {topics: {some: {category: {slug: {contains: search, mode: 'insensitive'}}}}}
      ]
    } : undefined,
    include: {
      topics: {
        include: {
          category: true
        }
      }
    },
    orderBy: {date: 'desc'}
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
            categoryId: t.categoryId,
            desc: t.desc
          }))
        }
      },
      include: {
        topics: {
          include: {
            category: true
          }
        }
      }
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
        categoryId: t.categoryId,
        desc: t.desc
      }))
    };
  }

  try {
    return await prisma.session.update({
      where: { id },
      data: updateFields,
      include: {
        topics: {
          include: {
            category: true
          }
        }
      }
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

const getStats = async () => {
  const sessions = await prisma.session.findMany({
    include: {
      topics: {
        include: {
          category: true
        }
      }
    }
  });

  const categories = await prisma.category.findMany();

  const sessionsCount = sessions.length;
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const topicsCount = sessions.reduce((acc, s) => {
    return acc + s.topics.reduce((sum, t) => {
      const parts = (t.desc || '').split(',').map(p => p.trim()).filter(Boolean);
      return sum + parts.length;
    }, 0);
  }, 0);

  const statsByCategory = {};
  for (const cat of categories) {
    statsByCategory[cat.slug] = 0;
  }

  for (const session of sessions) {
    for (const topic of session.topics) {
      if (topic.category && topic.category.slug) {
        const slug = topic.category.slug;
        const parts = (topic.desc || '').split(',').map(p => p.trim());
        statsByCategory[slug] = (statsByCategory[slug] || 0) + parts.length;
      }
    }
  }

  return {
    sessionsCount,
    hours,
    minutes,
    topicsCount,
    statsByCategory
  };
};

module.exports = { getAll, create, update, delete: remove, getStats };

