const path = require("path");
require("dotenv").config(); // Siempre cargar .env en local

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

console.log("✅ Entorno actual:", process.env.NODE_ENV);

