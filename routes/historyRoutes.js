const express = require('express');
const protect = require('../middleWare/authMiddleware');
const { getHistory, clearHistory } = require('../controllers/historyController');
const router = express.Router();

router.get('/', protect, getHistory);
router.delete('/', protect, clearHistory); 

module.exports = router;
