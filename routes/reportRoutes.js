const express = require("express");
const { createReport, getReports, getReportPDF, deleteReport } = require("../controllers/reportController");
const protect = require("../middleWare/authMiddleware");
const router = express.Router();

router.post("/", protect, createReport);
router.get("/", protect, getReports);
router.get("/:id/pdf", protect, getReportPDF);
router.delete("/:id", protect, deleteReport); 

module.exports = router;
