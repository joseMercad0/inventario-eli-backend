const asyncHandler = require("express-async-handler");
const History = require("../models/historyModel");

const getHistory = asyncHandler(async (req, res) => {
    const history = await History.find()
        .populate('user', 'name email') // Para mostrar nombre/email de usuario
        .populate('product', 'name');   // Para mostrar nombre del producto
    res.status(200).json(history);
});

module.exports = { getHistory };
