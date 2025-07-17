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

module.exports = { getHistory ,clearHistory,};
