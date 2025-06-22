const db = require('../config/db');

// Controlador para crear un contacto
exports.createContact = (req, res) => {
  // Obtenemos los datos enviados por el cliente
  const { name, email, phone, message } = req.body;

  // Validamos que no falten campos
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Preparamos la consulta SQL
  const sql = 'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)';

  // Ejecutamos la consulta usando los datos del cliente
  db.query(sql, [name, email, phone, message], (err, result) => {
    if (err) {
      console.error('Error al insertar:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    // Enviamos respuesta al cliente
    res.status(201).json({ message: 'Contacto guardado correctamente', id: result.insertId });
  });
};

// Controlador para obtener los contactos
exports.getContacts = (req, res) => {
  const sql = 'SELECT * FROM contacts';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener contactos:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    // Enviamos los contactos al cliente
    res.json(results);
  });
};
