const asyncHandler = require("express-async-handler");
const History = require("../models/historyModel");

const getHistory = asyncHandler(async (req, res) => {
    const history = await History.find()
        .populate('user', 'name email') // Muestra usuario
        .populate('product', 'name');   // Muestra producto
    res.status(200).json(history);
});

const clearHistory = async (req, res) => {
  await History.deleteMany({ user: req.user.id });
  res.status(200).json({ ok: true, msg: "Historial borrado." });
};

const getSalesReport = asyncHandler(async (req, res) => {
  // Puedes agregar filtros por rango de fechas, usuario, producto, etc.
  const { from, to } = req.query;
  const query = { action: "venta" };
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }
  const sales = await History.find(query)
    .populate('user', 'name email')
    .populate('product', 'name');
  res.status(200).json(sales);
});

module.exports = { getHistory ,clearHistory, getSalesReport};
