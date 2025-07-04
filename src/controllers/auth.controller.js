const {
  registerUserService,
  loginUserService,
} = require("../services/auth.service");

// Registro de usuario
exports.registerUser = async (req, res) => {
  try {
    const user = await registerUserService(req.body);
    res.status(201).json({ message: "Usuario registrado correctamente", user });
  } catch (error) {
    console.error("Error en registro:", error.message);

    res.status(error.status || 500).json({
      error: error.message || "Error al registrar usuario",
    });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const result = await loginUserService(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: error.message });
  }
};
