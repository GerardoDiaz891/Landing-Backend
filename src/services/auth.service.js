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

  // Usando await para la consulta con promesas
  const [result] = await db.query(sql, [
    cleanName,
    cleanEmail,
    hashedPassword,
    cleanRole,
  ]);

  return {
    id: result.insertId,
    name: cleanName,
    email: cleanEmail,
    role: cleanRole,
  };
};

// Verificar si el correo ya existe
const verifyUniqueEmail = async (email) => {
  const sql = "SELECT id_user FROM users WHERE email = ?";

  const [results] = await db.query(sql, [email]);

  if (results.length > 0) {
    const error = new Error("El correo ya está registrado");
    error.status = 409; // Conflict
    throw error;
  }

  return true; // Correo disponible
};

// Inicio de sesión
exports.loginUserService = async ({ email, password }) => {
  const cleanEmail = validator.normalizeEmail(email);
  const sql = "SELECT * FROM users WHERE email = ?";

  try {
    const [results] = await db.query(sql, [cleanEmail]);

    console.log("🧪 Email recibido:", email);
    console.log("🧪 Email normalizado:", cleanEmail);
    console.log("🧪 Resultados:", results);

    if (results.length === 0) throw new Error("Credenciales inválidas");

    const user = results[0];

    console.log("🧪 Usuario encontrado:", user);
    console.log("🧪 Password recibida:", password);
    console.log("🧪 Password en BD:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🧪 ¿Coinciden las contraseñas?", isMatch);

    if (!isMatch) throw new Error("Credenciales inválidas");


    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "20m" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    };
  } catch (error) {
    throw error;
  }
};
