const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
const contactRoutes = require("./routes/contact.routes");
app.use("/api/contacts", contactRoutes);

module.exports = app;
