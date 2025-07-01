const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

//POST
router.post('/', contactController.createContact);

//GET
router.get('/', contactController.getContacts);

//PUT
router.put('/:id', contactController.updateContact);

//DELETE
router.delete('/:id', contactController.deleteContact);

module.exports = router;
