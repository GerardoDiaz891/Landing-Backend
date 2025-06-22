const express = require('express');
const router = express.Router();  // Creamos un router (conjunto de rutas relacionadas)

const contactController = require('../controllers/contact.controller');

// POST /api/contacts → Guarda un contacto en la base de datos
router.post('/', contactController.createContact);

// GET /api/contacts → Obtiene todos los contactos guardados
router.get('/', contactController.getContacts);

module.exports = router;
