const express = require("express");
const { registerSale, salesHistory, clearSalesHistory } = require("../controllers/saleController");
const protect = require("../middleWare/authMiddleware");
const router = express.Router();

router.post("/", protect, registerSale);
router.get("/", protect, salesHistory);
router.delete("/history/clear", protect, clearSalesHistory);

module.exports = router;
