const express = require('express');
const router = express.Router();
const streamingController = require('../controllers/streamingController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', streamingController.getAll);
router.get('/:id', streamingController.getById);
router.post('/', cekApiKey, streamingController.create);
router.put('/:id', cekApiKey, streamingController.update);
router.delete('/:id', cekApiKey, streamingController.remove);

module.exports = router;