const express = require('express');
const app = express();

// Middlewares: funciones que se ejecutan antes de las rutas
// En este caso, sirven para que el servidor pueda entender datos en JSON o formularios
app.use(express.json());                          // Para recibir datos en formato JSON
app.use(express.urlencoded({ extended: true }));  // Para recibir datos de formularios (por ejemplo, cuando el frontend envía datos con POST)

// Importamos y usamos las rutas
const contactRoutes = require('./routes/contact.routes');
app.use('/api/contacts', contactRoutes);  // Todas las rutas de contacto estarán bajo /api/contacts

module.exports = app;
