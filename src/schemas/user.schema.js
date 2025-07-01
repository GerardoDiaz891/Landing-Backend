const joi = require("joi");

const userSchema = joi.object({
  name: joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no debe superar los 100 caracteres",
  }),

  email: joi.string().email().required().messages({
    "string.empty": "El correo es obligatorio",
    "string.email": "El correo no es válido",
  }),

  password: joi.string().min(6).required().messages({
    "string.empty": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
  }),
});

module.exports = userSchema;
