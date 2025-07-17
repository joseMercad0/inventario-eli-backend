const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number, // Precio del producto al momento de la venta
    }
  ],
  total: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Sale", saleSchema);
