const Sale = require("../models/saleModel");
const Product = require("../models/productModel");

// --- REGISTRAR VENTA ---
const registerSale = async (req, res) => {
  const { items } = req.body;
  let total = 0;
  const saleItems = [];  // <--- ¡DECLÁRALO AQUÍ!

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) return res.status(404).json({ msg: "Producto no encontrado" });
    if (product.quantity < item.quantity)
      return res.status(400).json({ msg: "Stock insuficiente" });

    // Descontar del stock
    product.quantity -= item.quantity;
    await product.save();

    saleItems.push({
      product: product._id,
      name: product.name,
      category: product.category,
      quantity: item.quantity,
      price: product.price,
    });
    total += product.price * item.quantity;
  }

  const sale = await Sale.create({
    items: saleItems,   // <--- ¡usa saleItems, no items!
    total,
    user: req.user.id
  });

  res.status(201).json(sale);
};


// --- HISTORIAL DE VENTAS ---
const salesHistory = async (req, res) => {
  const { from, to } = req.query; // Fechas opcionales para filtro
  let filter = {};
  if (from && to) filter.date = { $gte: new Date(from), $lte: new Date(to) };

const sales = await Sale.find(filter)
  .populate("items.product", "name category price") // agrega los campos que quieras
  .sort("-date");
res.status(200).json(sales);

};

// --- BORRAR HISTORIAL DE VENTAS ---
const clearSalesHistory = async (req, res) => {
  await Sale.deleteMany({ user: req.user.id });
  res.status(200).json({ ok: true });
};

module.exports = { registerSale, salesHistory, clearSalesHistory };
