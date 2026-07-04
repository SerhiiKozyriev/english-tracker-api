const categoryService = require('../services/categories.service');

const getAll = async (req, res) => {
  const { search } = req.query;
  const categories = await categoryService.getAll(search);
  res.status(200).json(categories);
};

const create = async (req, res) => {
  const newCategory = await categoryService.create(req.body);
  res.status(201).json(newCategory);
};

const update = async (req, res) => {
  const { id } = req.params;
  const updatedCategory = await categoryService.update(id, req.body);
  res.status(200).json(updatedCategory);
};

const remove = async (req, res) => {
  const { id } = req.params;
  await categoryService.delete(id);
  res.status(200).json({ message: 'Category deleted successfully', id });
};

module.exports = { getAll, create, update, delete: remove };
