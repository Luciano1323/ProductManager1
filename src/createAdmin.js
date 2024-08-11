const mongoose = require('mongoose');
const User = require('./models/userModel'); // Ajusta el path si es necesario
const bcrypt = require('bcrypt');

/**
 * Crea un usuario administrador con las credenciales dadas.
 */
const createAdmin = async () => {
  try {
    // Conectar a la base de datos MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/productmanager');

    // Hashear la contraseña usando bcrypt
    const hashedPassword = await bcrypt.hash('adminCoder', 10);

    // Crear un nuevo usuario administrador
    const adminUser = new User({
      username: 'adminCoder',
      password: hashedPassword,
      role: 'admin',
    });

    // Guardar el usuario administrador en la base de datos
    await adminUser.save();

    console.log('Usuario administrador creado con éxito');

    // Cerrar la conexión a la base de datos
    mongoose.connection.close();
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
  }
};

// Llamar a la función createAdmin
createAdmin();
