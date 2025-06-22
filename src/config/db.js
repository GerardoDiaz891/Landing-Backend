const mysql = require('mysql2');  // Importamos el paquete mysql2 para conectar con la base de datos
require('dotenv').config();       // Cargamos las variables del archivo .env

// Creamos la conexión usando las variables de entorno
const connection = mysql.createConnection({
  host: process.env.DB_HOST,        // Dirección del servidor de base de datos
  user: process.env.DB_USER,        // Usuario de MySQL
  password: process.env.DB_PASSWORD,// Contraseña
  database: process.env.DB_NAME     // Base de datos que vamos a usar
});

// Nos conectamos y validamos que todo esté bien
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la BD:', err);  // Si hay error, lo mostramos
    process.exit(1);                                   // Terminamos la app
  }
  console.log('Conexión exitosa a la base de datos');
});

module.exports = connection;  // Exportamos la conexión para usarla en otras partes del proyecto
