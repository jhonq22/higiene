const pool = require('../database/db');
const bcrypt = require('bcrypt');

// Controlador de inicio de sesión
const login = async (req, res) => {
  // Obtenemos las credenciales del usuario desde el cuerpo de la solicitud
  const { usuario, password } = req.body;

  try {
    // Consultamos la base de datos para buscar al usuario por su nombre de usuario
    const result = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);

    // Si no se encuentra ningún usuario con el nombre de usuario proporcionado, devolvemos un error 401
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Obtenemos la información del usuario
    const user = result.rows[0];

    // Comparamos la contraseña proporcionada con la contraseña almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Si la contraseña no coincide, devolvemos un error 401
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si las credenciales son correctas, establecemos una variable de sesión con el ID del usuario
    req.session.userId = user.id;

    // Enviamos una respuesta de éxito
    res.json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    // En caso de error en la base de datos u otro error, manejamos la excepción
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login };
