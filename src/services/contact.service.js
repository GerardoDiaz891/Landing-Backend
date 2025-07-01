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

// Función para registrar contacto
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
  const sql =
    "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";
  const insertId = await new Promise((resolve, reject) => {
    db.query(
      sql,
      [cleanName, cleanEmail, cleanPhone, cleanMessage],
      (err, result) => {
        if (err) {
          return reject(
            new Error("Error al guardar el contacto en la base de datos")
          );
        }
        resolve(result.insertId);
      }
    );
  });

  // Llamamos la función de Slack
  await sendLeadNotification(insertId);

  return {
    message: "Contacto guardado correctamente",
    id: insertId,
  };
};

// Función para enviar notificación a Slack
const sendLeadNotification = async (leadId) => {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  const payload = {
    text: `🎉 *Nuevo Lead Registrado*\n🆔 Lead #${leadId}\n📬 Se ha recibido un nuevo mensaje a través del formulario de contacto.`,
  };

  try {
    await axios.post(slackWebhookUrl, payload);
  } catch (error) {
    console.error("Error al enviar notificación a Slack:", error.message);
  }
};

// Función para obtener todos los contactos
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

// Eliminar contacto
exports.deleteContactService = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM contacts WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) {
        const error = new Error("Contacto no encontrado");
        error.status = 404;
        return reject(error);
      }
      resolve({ message: "Contacto eliminado correctamente" });
    });
  });
};

// Editar contacto
exports.updateContactService = async (id, data) => {
  const { name, email, phone, message } = data;

  const cleanName = validator.escape(validator.trim(name));
  const cleanEmail = validator.normalizeEmail(email);
  const cleanPhone = validator.whitelist(phone, "0-9");
  const cleanMessage = validator.escape(validator.trim(message));

  const { error } = contactSchema
    .fork(['token'], (schema) => schema.optional()) // Ignora el campo token
    .validate({ name: cleanName, email: cleanEmail, phone: cleanPhone, message: cleanMessage });

  if (error) {
    const err = new Error(error.details[0].message);
    err.status = 400;
    throw err;
  }

  return new Promise((resolve, reject) => {
    const sql = "UPDATE contacts SET name = ?, email = ?, phone = ?, message = ? WHERE id = ?";
    db.query(sql, [cleanName, cleanEmail, cleanPhone, cleanMessage, id], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) {
        const error = new Error("Contacto no encontrado");
        error.status = 404;
        return reject(error);
      }
      resolve({ message: "Contacto actualizado correctamente" });
    });
  });
};