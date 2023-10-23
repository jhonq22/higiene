const pool = require('../database/db');
const bcrypt = require('bcrypt');

// Registro de usuario
const register = async (req, res) => {
  const { cedula, nombres, apellidos, usuario, password, rol_id, estado } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO usuarios (cedula, nombres, apellidos, usuario, password, rol_id, estado) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [cedula, nombres, apellidos, usuario, hashedPassword, rol_id, estado]
    );

    res.json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { register };
