const db = require("../config/db");
const axios = require("axios");
require("dotenv").config();
const joi = require("joi");
const validator = require("validator");

// Esquema de validación
const contactSchema = joi.object({
  name: joi.string().min(3).max(100).required(),
  email: joi.string().email().required(),
  phone: joi
    .string()
    .pattern(/^[0-9]{7,15}$/)
    .required(),
  message: joi.string().min(5).max(500).required(),
  token: joi.string().required(),
});

//CREAR CONTACTOS
exports.createContact = async (req, res) => {
  const { name, email, phone, message, token } = req.body;

  // Sanitizar entradas
  const cleanName = validator.escape(validator.trim(name));
  const cleanEmail = validator.normalizeEmail(email);
  const cleanPhone = validator.whitelist(phone, "0-9");
  const cleanMessage = validator.escape(validator.trim(message));

  // Validar con Joi
  const { error } = contactSchema.validate({
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    message: cleanMessage,
    token,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Validar el token con Google
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
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
    db.query(
      sql,
      [cleanName, cleanEmail, cleanPhone, cleanMessage],
      (err, result) => {
        if (err) {
          console.error("Error al insertar:", err);
          return res.status(500).json({ error: "Error en el servidor" });
        }

        res.status(201).json({
          message: "Contacto guardado correctamente",
          id: result.insertId,
        });
      }
    );
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
