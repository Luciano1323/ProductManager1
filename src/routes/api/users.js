// routes/api/users.js

const express = require('express');
const router = express.Router();
const User = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Cart = require('../../models/cartModel');

router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Obtener todos los usuarios
    res.json(users); // Enviar la respuesta en formato JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || 'user',
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Crear el carrito
    const newCart = new Cart();
    const savedCart = await newCart.save();

    // Crear el usuario con referencia al carrito
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      cart: savedCart._id // Referencia al carrito
    });
    const savedUser = await newUser.save();

    res.status(201).json({ ...savedUser.toObject(), cartId: savedCart._id });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar al usuario por nombre de usuario
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Crear el token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar la respuesta
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

module.exports = router;
