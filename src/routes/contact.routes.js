const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

//POST
router.post('/', contactController.createContact);

//GET
router.get('/', contactController.getContacts);

module.exports = router;
