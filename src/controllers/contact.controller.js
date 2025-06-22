const db = require('../config/db');

//CREAR CONTACTOS
exports.createContact = (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const sql = 'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, phone, message], (err, result) => {
    if (err) {
      console.error('Error al insertar:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(201).json({ message: 'Contacto guardado correctamente', id: result.insertId });
  });
};

//OBTENER CONTACTOS
exports.getContacts = (req, res) => {
  db.query('SELECT * FROM contacts', (err, results) => {
    if (err) {
      console.error('Error al obtener contactos:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
};
