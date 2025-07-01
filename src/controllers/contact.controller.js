const {
  createContactService,
  getContactsService,
  deleteContactService,
  updateContactService,
} = require("../services/contact.service.js");

// CREAR CONTACTOS
exports.createContact = async (req, res) => {
  try {
    const result = await createContactService(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al registrar contacto:", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Error interno del servidor" });
  }
};

// OBTENER CONTACTOS
exports.getContacts = async (req, res) => {
  try {
    const contacts = await getContactsService();
    res.json(contacts);
  } catch (error) {
    console.error("Error al obtener contactos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Eliminar contacto
exports.deleteContact = async (req, res) => {
  try {
    const result = await deleteContactService(req.params.id);
    res.json(result);
  } catch (error) {
    console.error("Error al eliminar contacto:", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Error interno" });
  }
};

// Actualizar contacto
exports.updateContact = async (req, res) => {
  try {
    const result = await updateContactService(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    console.error("Error al actualizar contacto:", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Error interno" });
  }
};