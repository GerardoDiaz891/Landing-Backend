const db = require("../config/db");
const axios = require("axios");

//CREAR CONTACTOS
exports.createContact = async (req, res) => {
  const { name, email, phone, message, token } = req.body;

  console.log("BODY:", req.body);

  if (!name || !email || !phone || !message || !token) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  try {
    // Validar el token con Google
    const secretKey = "6LcUZmsrAAAAAKqbQe2LTtcTSsP88zjMxz5qBiOH";
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    const data = response.data;

    if (!data.success) {
      return res.status(403).json({ error: "Verificación reCAPTCHA fallida" });
    }

    // Si pasó la verificación, guardamos en la base de datos
    const sql =
      "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, phone, message], (err, result) => {
      if (err) {
        console.error("Error al insertar:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }

      res.status(201).json({
        message: "Contacto guardado correctamente",
        id: result.insertId,
      });
    });
  } catch (error) {
    console.error("Error al verificar reCAPTCHA:", error);
    res.status(500).json({ error: "Error al verificar reCAPTCHA" });
  }
};

//OBTENER CONTACTOS
exports.getContacts = (req, res) => {
  db.query("SELECT * FROM contacts", (err, results) => {
    if (err) {
      console.error("Error al obtener contactos:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
};
