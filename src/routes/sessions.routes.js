const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessions.controller');

router.get('/', sessionController.getAll);
router.post('/', sessionController.create);
router.delete('/:id', sessionController.delete);

module.exports = router;
