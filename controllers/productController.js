const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;
const History = require("../models/historyModel"); // <-- Asegúrate de crearlo antes

// Crear Producto
const createProduct = asyncHandler(async (req, res) => {
       console.log("User:", req.user);
      console.log("Body:", req.body);
      console.log("File:", req.file);

   const { name, sku, category, quantity, price, description } = req.body;
   if (!name || !category || !quantity || !price || !description) {
      res.status(400);
      throw new Error("Por favor llenar todas las celdas");
   }


   let fileData = {};
   if (req.file) {
      let uploadedFile;
      try {
         uploadedFile = await cloudinary.uploader.upload(req.file.path, { folder: "Inventario App", resource_type: "image" });
      } catch (error) {
         res.status(500);
         throw new Error("Image could not be uploaded");
      }
      fileData = {
         fileName: req.file.originalname,
         filePath: uploadedFile.secure_url,
         fileType: req.file.mimetype,
         fileSize: fileSizeFormatter(req.file.size, 2),
      };
   }

   const product = await Product.create({
      user: req.user.id,
      name,
      sku,
      category,
      quantity,
      price,
      description,
      image: fileData,
   });

   // === HISTORIAL ===
   await History.create({
      product: product._id,
      action: "agregado",
      user: req.user.id,
      details: `Producto creado: ${name}`,
   });

   res.status(201).json(product);
});

// Get all Products
const getProducts = asyncHandler(async (req, res) => {
   const products = await Product.find({ user: req.user.id }).sort("-createdAt");
   res.status(200).json(products);
});

// Get Single Product
const getProduct = asyncHandler(async (req, res) => {
   const product = await Product.findById(req.params.id);
   if (!product) {
      res.status(404);
      throw new Error("Product not found");
   }
   if (product.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Usuario No Autorizado");
   }
   res.status(200).json(product);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
   const product = await Product.findById(req.params.id);
   if (!product) {
      res.status(404);
      throw new Error("Product not found");
   }
   if (product.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Usuario No Autorizado");
   }
   await Product.findByIdAndDelete(req.params.id);

   // === HISTORIAL ===
   await History.create({
      product: product._id,
      action: "eliminado",
      user: req.user.id,
      details: `Producto eliminado: ${product.name}`,
   });

   res.status(200).json({ message: "Producto Borrado." });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
   const { name, category, quantity, price, description } = req.body;
   const { id } = req.params;
   const product = await Product.findById(req.params.id);
   if (!product) {
      res.status(404);
      throw new Error("Product not found");
   }
   if (product.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Usuario No Autorizado");
   }
   let fileData = {};
   if (req.file) {
      let uploadedFile;
      try {
         uploadedFile = await cloudinary.uploader.upload(req.file.path, { folder: "Inventario App", resource_type: "image" });
      } catch (error) {
         res.status(500);
         throw new Error("Image could not be uploaded");
      }
      fileData = {
         fileName: req.file.originalname,
         filePath: uploadedFile.secure_url,
         fileType: req.file.mimetype,
         fileSize: fileSizeFormatter(req.file.size, 2),
      };
   };

   const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      {
         name,
         category,
         quantity,
         price,
         description,
         image: Object.keys(fileData).length === 0 ? product?.image : fileData,
      },
      { new: true, runValidators: true }
   );

   // === HISTORIAL ===
   await History.create({
      product: product._id,
      action: "editado",
      user: req.user.id,
      details: `Producto editado: ${name}`,
   });

   await History.create({
   product: product._id,
   action: "venta",
   user: req.user.id,
   details: `Se vendieron ${cantidadVendida} unidades. Stock restante: ${product.quantity}`,
   });


   res.status(200).json(updatedProduct);
});

module.exports = {
   createProduct,
   getProducts,
   getProduct,
   deleteProduct,
   updateProduct,
};

