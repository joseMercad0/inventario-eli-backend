const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//registerUser

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // VALIDATION
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Por favor llenar los campos requeridos");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("La contraseña debe tener mas de 6 caracteres");
  }

  //check if user email already exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400);
    throw new Error("Este correo ya esta registrado");
  }





  //Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  //Generate Toker
  const token = generateToken(user._id);

  //send cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Datos Invalidos de Usuario ");
  }
});

//Login User

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validar respuesta
  if (!email || !password) {
    res.status(400);
    throw new Error("Por favor agregar Correo y contraseña");
  }

  //si el usuario existe
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("El usuario no existe, por favor reguistrese");
  }

  //usuario existe , si la contraseña es correcta
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //Generate Toker
  const token = generateToken(user._id);

  if (passwordIsCorrect) {

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

  }



  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Contraseña o Correo invalidado");
  }

});


//Cerrar Sesion Usuario
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Cerro Sesion Correctamente" });
});

//obtener los datos del Usuario

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("Usuario no Encontrado");
  }
});

// Tener el estado del Acceso
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  //Verificar Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

// Actualizar Usuario
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updateUser = await user.save();
    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      photo: updateUser.photo,
      phone: updateUser.phone,
      bio: updateUser.bio,
    })
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});


const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("Usuario no encontrado por favor registrese");
  }
  //Validate
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error(" Agrege la anterior y  nueva contraseña ");
  }
  //ckequear si la contrseña es correcta
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  //Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Contraseña cambiada correctamente");
  } else {
    res.status(400);
    throw new Error("Anterior Contraseña incorrecta");
  }

});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Usuario no existente");

  };

  // Delete Token if existe en la DB
  let token = await Token.findOne({userId: user._id});
  if (token) {
    await token.deleteOne();
  }
 
  //CreaR Token de reseteo
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  //Encriptar token para guardarlo en la DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Save token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000) // Treinta Minutos
  }).save();

  //Contruir el enlace de reseteo
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  //Reset Email
  const message = `
    <h2>Hello ${user.name}</h2>
    <p>Por favor usa el Url para que pueda restablecer su contraseña</p>
    <p>Este link solo funcionara solo en 30 minutos</p>
    <a href=${resetUrl} clicktracking=off >${resetUrl}</a>

    <p>Recuerde</p>
    <p>Inventario Eli</p>
  `;
  const subject = "Contraseña Restableciendo"
  const send_to = user.email
  const sent_from = process.env.EMAIL_USER

  try {
      await sendEmail(subject, message, send_to, sent_from);
      res.status(200).json({success: true, message:"Correo de Restablecimiento Enviado"});
  } catch (error) {
      res.status(500);
      throw new Error("Correo no enviado, Intentelo mas tarde");
  }

});

// resetear contraseña 
const resetPassword = asyncHandler (async (req, res) => {
   
  const {password} = req.body;
  const {resetToken} = req.params;

  //Token Encriptado, para compararlo conla de la DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Buscar la token en DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: {$gt: Date.now()},
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Token expirado o invalidado");
  }

  //Encontrar Usuario
  const user = await User.findOne({_id: userToken.userId})
  user.password = password
  await user.save()
  res.status(200).json({
    message: "Contraseña restablecida, ahora puede acceder"
  });

});


module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};