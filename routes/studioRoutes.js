const express = require('express');
const router = express.Router();
const c = require('../controllers/studioController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', c.getAll);
router.post('/', cekApiKey, c.create);

module.exports = router;
