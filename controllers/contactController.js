const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");


const contactUs = asyncHandler(async (req, res) => {
    const { subject, message } = req.body;
    const user = await User.findById(req.user._id)

    if (!user) {
        res.status(400)
        throw new Error("Ususario no encontrado porfavor Inicia sesion")
    }


    //Validation
    if (!subject || !message) {
        res.status(400)
        throw new Error("Por favor agrege el tema y el mensaje")
    }

    const send_to = process.env.EMAIL_USER;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = user.email;

    try {
        await sendEmail(subject, message, send_to, sent_from, reply_to);
        res.status(200).json({ success: true, message: "Correo Enviado" });
    } catch (error) {
        res.status(500);
        throw new Error("Correo no enviado, Intentelo mas tarde");
    }
});

module.exports = {
    contactUs,
};