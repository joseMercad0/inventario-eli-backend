const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  nombreInforme: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  periodo: {
    desde: { type: Date, required: true },
    hasta: { type: Date, required: true }
  },
  datosEmpresa: {
    nombre: { type: String, required: true },
    ruc: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String, required: true }
   
  },
  resumen: {}, // Un objeto flexible para guardar totales, productos más vendidos, etc.
  pdfBase64: { type: String, required: true } // El PDF codificado en base64
});

module.exports = mongoose.model("Report", reportSchema);
