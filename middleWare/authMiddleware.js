const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler (async (req, res, next) => {
   try {
       const token = req.cookies.token
       if (!token){
           res.status(401)
           throw new Error(" No esta Autorizado, por favor inicia Sesion");
       }

       //Verificar Token
       const verified = jwt.verify(token,process.env.JWT_SECRET);
       //Obtener id de usuario del token
       user = await User.findById(verified.id).select("-password")

       if (!user) {
            res.status(401);
            throw new Error(" Usuario no encontrado");
       }
       req.user = user
       next();

   } catch (error) {
        res.status(401);
        throw new Error(" No esta permitido , porfavor Iniciar Sesion");
   }
});

module.exports = protect