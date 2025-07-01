const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const validator = require("validator");
const userSchema = require("../schemas/user.schema");
require("dotenv").config();

// Registro de usuario
exports.registerUserService = async ({
  name,
  email,
  password,
  role = "user",
}) => {
  const cleanName = validator.escape(validator.trim(name));
  const cleanEmail = validator.normalizeEmail(email);
  const cleanRole = role === "admin" ? "admin" : "user";

  const { error } = userSchema.validate({
    name: cleanName,
    email: cleanEmail,
    password,
    role: cleanRole,
  });

  if (error) {
    const err = new Error(error.details[0].message);
    err.status = 400;
    throw err;
  }

  // Verificar email único
  await verifyUniqueEmail(cleanEmail);

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [cleanName, cleanEmail, hashedPassword, cleanRole],
      (err, result) => {
        if (err) return reject(err);
        resolve({
          id: result.insertId,
          name: cleanName,
          email: cleanEmail,
          role: cleanRole,
        });
      }
    );
  });
};

// Verificar si el correo ya existe
const verifyUniqueEmail = async (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id_user FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) return reject(new Error("Error al verificar el correo"));

      if (results.length > 0) {
        const error = new Error("El correo ya está registrado");
        error.status = 409; // Conflict
        return reject(error);
      }

      resolve(true); // Correo disponible
    });
  });
};

// Inicio de sesión
exports.loginUserService = async ({ email, password }) => {
  const cleanEmail = validator.normalizeEmail(email);

  const sql = "SELECT * FROM users WHERE email = ?";
  return new Promise((resolve, reject) => {
    db.query(sql, [cleanEmail], async (err, results) => {
      if (err) return reject(err);
      if (results.length === 0)
        return reject(new Error("Credenciales inválidas"));

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return reject(new Error("Credenciales inválidas"));

      const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      resolve({
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
        },
      });
    });
  });
};
