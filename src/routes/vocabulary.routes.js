const { Router } = require('express');
const controller = require('../controllers/vocabulary.controller');

const router = Router();

router.get('/', controller.getWords);
router.post('/', controller.createWord);
router.patch('/:id', controller.updateWord);
router.delete('/:id', controller.deleteWord);

module.exports = router;
