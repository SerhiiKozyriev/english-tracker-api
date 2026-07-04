const prisma = require('../prisma');
const {NotFoundError, ConflictError} = require('../utils/errors');

const getAll = async (search) => await prisma.category.findMany();

const create = async (data) => {
    const display_name = data.display_name.trim();
    const slug = data.slug.trim();

    const existingCategory = await prisma.category.findFirst({
        where: {slug}
    });
    if (existingCategory) {
        throw new ConflictError(`Category with slug '${slug}' already exists`);
    }

    return await prisma.category.create({
        data: {
            display_name,
            slug
        }
    });
};

const update = async (id, data) => {
    const updateFields = {};

    if (data.display_name !== undefined) {
        updateFields.display_name = data.display_name.trim();
    }

    if (data.slug !== undefined) {
        updateFields.slug = data.slug.trim();

        const existingCategory = await prisma.category.findFirst({
            where: {
                slug: updateFields.slug,
                id: {not: id}
            }
        });
        if (existingCategory) {
            throw new ConflictError(`Category with slug '${updateFields.slug}' already exists`);
        }
    }

    try {
        return await prisma.category.update({
            where: {id},
            data: updateFields
        });
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError('Category not found');
        }
        throw error;
    }
};

const remove = async (id) => {
    try {
        await prisma.category.delete({
            where: {id}
        });
        return true;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError('Category not found');
        }
        if (error.code === 'P2003') {
            throw new ConflictError('Cannot delete category because it is in use by topics');
        }
        throw error;
    }
};

module.exports = {getAll, create, update, delete: remove};
