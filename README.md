GUÍA PARA CREAR UN BACKEND EN NODE.JS + EXPRESS + MYSQL

CREACIÓN DEL PROYECTO:
mkdir landing-backend
cd landing-backend
npm init -y  # Inicializa el proyecto con un package.json por defecto

DEPENDIENCIAS:
npm install express mysql2 dotenv  # Express para el servidor, mysql2 para conectar con MySQL, dotenv para variables de entorno
npm install --save-dev nodemon     # Nodemon reinicia el servidor al guardar cambios (solo en desarrollo)

CONCEPTOS
¿Qué es un middleware?
Un middleware es una función que intercepta la petición antes de que llegue a la ruta o después de la ruta.
Ejemplo: express.json() es un middleware que convierte el body de un request en un objeto JavaScript que podemos usar.

 ¿Qué es un router?
Un router nos permite organizar las rutas según funcionalidad. Aquí agrupamos todas las rutas de contactos en un solo archivo.

¿Qué es un controlador?
El controlador contiene la lógica de negocio, es decir, lo que debe suceder cuando alguien hace una petición a una ruta.

FLUJO DEL BACKEND:
1️⃣ El cliente (frontend o Postman) hace una petición a http://localhost:3000/api/contacts

2️⃣ Express recibe la petición y pasa por los middlewares

3️⃣ Se enruta según la URL → el router decide si es POST o GET y llama al controlador adecuado

4️⃣ El controlador hace la consulta a la base de datos usando mysql2

5️⃣ La base de datos responde → el controlador forma una respuesta y la envía al cliente

CONCEPTOS CLAVE:

✅ Servidor Express → Atiende peticiones y devuelve respuestas

✅ Router → Organiza rutas relacionadas

✅ Controlador → Lógica de qué hacer con cada ruta

✅ Middleware → Código que se ejecuta antes o después de las rutas (por ejemplo, express.json() transforma el body)

✅ MySQL2 → Conecta y ejecuta consultas a la base de datos

✅ dotenv → Maneja variables de entorno
