const express = require('express');
const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
const contactRoutes = require('./routes/contact.routes');
app.use('/api/contacts', contactRoutes);

module.exports = app;
