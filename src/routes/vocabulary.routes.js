const { Router } = require('express');
const controller = require('../controllers/vocabulary.controller');

const router = Router();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.patch('/:id/status', controller.toggleStatus);

module.exports = router;
