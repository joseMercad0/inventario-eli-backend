const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // 1. TOKEN POR COOKIE
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2. TOKEN POR HEADER (Bearer)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("No está autorizado, por favor inicia sesión");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Usuario no encontrado");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Token inválido, por favor inicia sesión");
  }
});

module.exports = protect;
