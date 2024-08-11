const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const logger = require('./utils/logger');
const config = require('./config/config');
const app = express();

// Configuración de la base de datos
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) => logger.error("Error connecting to MongoDB", error));

// Configuración de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configuración de sesiones
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Configuración de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de rutas
app.use('/api/users', require('./routes/api/users'));
app.use('/api/products', require('./routes/api/products'));
app.use('/api/carts', require('./routes/api/carts'));
app.use('/api/mocking', require('./services/mockRoutes'));

// Manejo de errores
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Iniciar el servidor
const port = config.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
