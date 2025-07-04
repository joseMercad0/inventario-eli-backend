const express = require('express');
const protect = require('../middleWare/authMiddleware');
const { getHistory } = require('../controllers/historyController');
const router = express.Router();

router.get('/', protect, getHistory);

module.exports = router;
