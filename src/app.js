const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = [
  "http://localhost:4173",
  "http://localhost:5173",
  "https://landingfrontend-production.up.railway.app",
];

// Middleware CORS configurado ANTES de cualquier otra ruta o middleware
app.use(cors({
  origin: function (origin, callback) {
    // Permite solicitudes sin origen (Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `El CORS policy no permite acceso desde este origen: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true  // Solo si usas cookies o autenticación con credenciales
}));

// Para asegurarte que responde al preflight OPTIONS
app.options('*', cors());

// Middlewares para parseo de body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const contactRoutes = require("./routes/contact.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api/contacts", contactRoutes);
app.use("/api/auth", authRoutes);

// Debug de rutas registradas
if (app._router && app._router.stack) {
  app._router.stack
    .filter(r => r.route && r.route.path)
    .forEach(r => {
      const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
      console.log(`📡 Ruta: ${methods} ${r.route.path}`);
    });
} else {
  console.warn("⚠️ No hay rutas registradas aún.");
}

module.exports = app;
