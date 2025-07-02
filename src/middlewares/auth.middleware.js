const jwt = require("jsonwebtoken");

// Verificar Token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica si se envió el token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // adjuntamos el usuario a la request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// Acceso a usuario con rol de admin
exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acceso denegado: solo para administradores" });
  }
  next();
};
