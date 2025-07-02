const mysql = require('mysql2');
require('dotenv').config();

// Verificar que las variables de entorno estén definidas
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Faltan las siguientes variables de entorno:', missingVars.join(', '));
  process.exit(1);
}

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la BD:', err.message);
    console.error('Código de error:', err.code);
    process.exit(1);
  }
  console.log('Conexión exitosa a la base de datos');
});

module.exports = connection;
