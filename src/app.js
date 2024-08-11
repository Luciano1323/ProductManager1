require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const logger = require('./utils/logger');
const userRoutes = require('./routes/api/users'); // Asegúrate de que la ruta sea correcta
const productRoutes = require('./routes/api/products');
const errorHandler = require('./middleware/errorHandler');
const swaggerSetup = require('./config/swagger');
const config = require('./config/config');
const cartRoutes = require('./routes/api/carts');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET || 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Product Manager API');
});

// Middleware de manejo de errores
app.use(errorHandler);

// Definir una ruta 404 para manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/productmanager', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) => logger.error("Error connecting to MongoDB", error));

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

module.exports = app;
