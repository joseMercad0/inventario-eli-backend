const Report = require("../models/reportModel");

const createReport = async (req, res) => {
  try {
    const {
      nombreInforme,
      periodo,
      datosEmpresa,
      resumen,
      pdfBase64
    } = req.body;

    const report = await Report.create({
      user: req.user.id,
      nombreInforme,
      periodo,
      datosEmpresa,
      resumen,
      pdfBase64
    });

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort("-fechaCreacion");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Para obtener el PDF en base64:
const getReportPDF = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user.id });
    if (!report) return res.status(404).json({ message: "Informe no encontrado" });
    res.json({ pdfBase64: report.pdfBase64, nombreInforme: report.nombreInforme });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    // Borra solo si pertenece al usuario autenticado
    const deleted = await Report.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Informe no encontrado" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportPDF,
  deleteReport
};
