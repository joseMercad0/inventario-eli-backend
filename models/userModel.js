const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
       name: {
          type: String,
          required: [true, "Please add a name"]
       },
       email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
        tim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email address"
        ]
       },
       password:{
        type: String,
        required: [true, "Por favor Agregar Una contraseña"],
        minLength: [6, "Password must be up to 6 characters"],
        //maxLength: [23, "Password must not bet up to 23 characters"],
        
       },
       photo: {
            type: String,
            required: [true, "Please add a photo"],
            default: "https://i.ibb.co/4pDNDk1/avatar.png"
       },
       phone: {
        type: String,
        default:"+51"
       },
       bio: {
        type: String,
        maxLength: [250, "Bio must not bet up to 250 characters"],
        default:"bio"
       },
            
       
    }, 
    {
        timestamps: true,
    }
);

// Encriptar contraseña de la base de datos
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }

    //hash password    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
    });

const User = mongoose.model("User",userSchema);
module.exports = User;