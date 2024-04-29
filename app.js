const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const socketIO = require("socket.io");
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./authRoutes');
const apiRoutes = require('./apiRoutes');
const User = require('./userModel');

// Configuración de Passport
require('./passportConfig');
require('./jwtStrategy');

mongoose.connect('mongodb://127.0.0.1:27017/your_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main"}));
app.set("view engine", ".hbs");
app.use(express.static(__dirname + "/public"));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', apiRoutes);

// Endpoint para obtener productos con paginación, filtros y ordenamiento
app.get("/api/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const result = await productManager.getProducts({ limit, page, sort, query });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint para eliminar un producto del carrito
app.delete("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartManager.removeProductFromCart(cid, pid);
    res.json({ status: "success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Ruta para renderizar la vista home.handlebars
app.get("/home", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Implementa las rutas y controladores para el chat...

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

server.listen(3000, () => {
  console.log(`Server is listening at http://localhost:3000`);
});
