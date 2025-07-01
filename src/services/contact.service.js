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

exports.createContactService = async ({
  name,
  email,
  phone,
  message,
  token,
}) => {
  // Sanitizar entradas
  const cleanName = validator.escape(validator.trim(name));
  const cleanEmail = validator.normalizeEmail(email);
  const cleanPhone = validator.whitelist(phone, "0-9");
  const cleanMessage = validator.escape(validator.trim(message));

  // Validar
  const { error } = contactSchema.validate({
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    message: cleanMessage,
    token,
  });

  if (error) {
    const err = new Error(error.details[0].message);
    err.status = 400;
    throw err;
  }

  // Validar token reCAPTCHA
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

  if (!response.data.success) {
    const err = new Error("Verificación reCAPTCHA fallida");
    err.status = 403;
    throw err;
  }

  // Guardar en base de datos
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";
    db.query(
      sql,
      [cleanName, cleanEmail, cleanPhone, cleanMessage],
      (err, result) => {
        if (err) {
          return reject(
            new Error("Error al guardar el contacto en la base de datos")
          );
        }
        resolve({
          message: "Contacto guardado correctamente",
          id: result.insertId,
        });
      }
    );
  });
};

// Obtener contactos
exports.getContactsService = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM contacts ORDER BY id DESC";
    db.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};
