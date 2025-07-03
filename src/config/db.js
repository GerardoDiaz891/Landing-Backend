const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexión exitosa a la base de datos");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Error al conectar a la BD:", error.message);
    console.error("Código de error:", error.code);
    return false;
  }
}

testConnection();

module.exports = pool;
