const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name:{
        type: String,
        required: [true, "Por favor agrega mi nombre"],
        trim: true
    },
    sku:{
        type: String,
        required: true,
        default: "SKU",
        trim: true
    },
    category:{
        type: String,
        required: [true, "Por favor agrega una categoria"],        
        trim: true
    },
    quantity:{
        type: String,
        required: [true, "Por favor agrega una cantidad"],        
        trim: true
    },
    price:{
        type: String,
        required: [true, "Por favor agrega una precio"],        
        trim: true
    },
    description:{
        type: String,
        required: [true, "Por favor agrega una descripcion"],        
        trim: true
    },
    image:{
        type: Object,
        default:{}
    },


},{
    timestamps:true,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;