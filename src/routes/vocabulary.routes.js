const { Router } = require('express');
const controller = require('../controllers/vocabulary.controller');

const router = Router();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/stats', controller.getStats);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
