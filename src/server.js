require('dotenv').config();  // Cargamos variables de entorno
const app = require('./app');

const PORT = process.env.PORT || 3000;  // Definimos el puerto, usando el de .env o 3000 por defecto

// Ponemos a escuchar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
