const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categories.controller');
const validate = require('../middleware/validate');
const {
  createCategorySchema,
  updateCategorySchema,
  getCategoriesSchema,
  getCategoryByIdSchema,
  deleteCategorySchema
} = require('../schemas/category.schema');

router.get('/', validate(getCategoriesSchema), categoryController.getAll);
router.post('/', validate(createCategorySchema), categoryController.create);
router.patch('/:id', validate(updateCategorySchema), categoryController.update);
router.delete('/:id', validate(deleteCategorySchema), categoryController.delete);

module.exports = router;
