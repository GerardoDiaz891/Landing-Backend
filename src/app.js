const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = [
  "http://localhost:4173",
  "http://localhost:5173",
  "https://landingfrontend-production.up.railway.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite solicitudes sin origen (como Postman o curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `El CORS policy no permite acceso desde este origen: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const contactRoutes = require("./routes/contact.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api/contacts", contactRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
