const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const historyRoutes = require('./routes/historyRoutes');
const contactRoute = require("./routes/contactRoute");
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser");
const path = require("path");
const saleRoutes = require("./routes/saleRoutes");
const reportRoutes = require("./routes/reportRoutes");
const app = express();


// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000','https://inventarioeli-app.vercel.app'], // Cambia por el puerto de tu frontend
  credentials: true
}));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));



//RUTAS MIDDLEWARES 
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use('/api/history', historyRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/contactus", contactRoute);

//RUTAS 

app.get ("/", (req, res) => {
    res.send("Home Page");
});

//ERROR MIDDLEWARE
app.use(errorHandler);

// conectando a base de datos y iniciar servidor
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log("server Corriendo en el puerto 5000");
        });
    })
    .catch((err) => console.log(err));
