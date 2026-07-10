const prisma = require('../prisma');
const {NotFoundError, ConflictError} = require('../utils/errors');

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
    const {topics, ...fields} = sessionData;
    try {
        return await prisma.session.create({
            data: {
                ...fields,
                topics: {
                    create: topics.map(t => ({
                        categoryId: t.category.id,
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
    const {topics, ...updateFields} = sessionData;

    if (topics !== undefined) {
        updateFields.topics = {
            deleteMany: {},
            create: topics.map(t => ({
                categoryId: t.category.id,
                desc: t.desc
            }))
        };
    }

    try {
        return await prisma.session.update({
            where: {id},
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
            where: {id}
        });
        return true;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError('Session not found');
        }
        throw error;
    }
};

const toDayNumber = (dateStr) => {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return Math.floor(d.getTime() / 86_400_000);
};

const getStats = async () => {
    const sessions = await prisma.session.findMany({
        include: {
            topics: {
                include: {
                    category: true
                }
            }
        },
        orderBy: {date: 'desc'}
    });

    const sessionsCount = sessions.length;

    if (sessionsCount === 0) {
        return {sessionsCount: 0, hours: 0, minutes: 0, topicsCount: 0, streak: 0, statsByCategory: {}};
    }

    const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let topicsCount = 0;
    const statsByCategory = {};
    const dayNumbers = [];

    for (const session of sessions) {
        dayNumbers.push(toDayNumber(session.date));

        for (const topic of session.topics) {
            const partsCount = topic.desc
                ? topic.desc.split(',').map(p => p.trim()).filter(Boolean).length
                : 0;

            topicsCount += partsCount;

            if (topic.category?.slug) {
                const slug = topic.category.slug;
                statsByCategory[slug] = (statsByCategory[slug] || 0) + partsCount;
            }
        }
    }

    let streak = 0;

    const uniqueDays = [...new Set(dayNumbers)];
    const today = toDayNumber(new Date());

    if (uniqueDays[0] >= today - 1) {
        streak = 1;

        for (let i = 1; i < uniqueDays.length; i++) {
            if (uniqueDays[i - 1] - uniqueDays[i] === 1) {
                streak++;
            } else {
                break;
            }
        }
    }

    return {
        sessionsCount,
        hours,
        minutes,
        topicsCount,
        streak,
        statsByCategory
    };
};

module.exports = {getAll, create, update, delete: remove, getStats};

