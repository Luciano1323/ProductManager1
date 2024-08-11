const Cart = require('../models/cartModel');
const User = require('../models/userModel');

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

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};
