const express = require('express');
const router = express.Router();
const c = require('../controllers/streamingController');
const cekApiKey = require('../middlewares/cekApiKey');

// Route publik (hanya membaca data)
router.get('/', c.getAll);
router.get('/:id', c.getById);

// Route terlindungi (membutuhkan x-api-key)
router.post('/', cekApiKey, c.create);
router.put('/:id', cekApiKey, c.update);
router.delete('/:id', cekApiKey, c.remove);

module.exports = router;