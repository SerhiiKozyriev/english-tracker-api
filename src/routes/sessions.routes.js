const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessions.controller');
const validate = require('../middleware/validate');
const {
  createSessionSchema,
  updateSessionSchema,
  getSessionsSchema,
  deleteSessionSchema
} = require('../schemas/session.schema');

router.get('/', validate(getSessionsSchema), sessionController.getAll);
router.post('/', validate(createSessionSchema), sessionController.create);
router.patch('/:id', validate(updateSessionSchema), sessionController.update);
router.delete('/:id', validate(deleteSessionSchema), sessionController.delete);

module.exports = router;
