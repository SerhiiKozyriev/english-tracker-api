const { Router } = require('express');
const controller = require('../controllers/vocabulary.controller');
const validate = require('../middleware/validate');
const {
  getWordsSchema,
  createWordSchema,
  updateWordSchema,
  deleteWordSchema
} = require('../schemas/vocabulary.schema');

const router = Router();

router.get('/', validate(getWordsSchema), controller.getAll);
router.post('/', validate(createWordSchema), controller.create);
router.get('/stats', controller.getStats);
router.patch('/:id', validate(updateWordSchema), controller.update);
router.delete('/:id', validate(deleteWordSchema), controller.delete);

module.exports = router;
