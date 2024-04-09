const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const socketIO = require("socket.io");
const session = require("express-session"); // Agregar express-session para manejar sesiones
const ProductManager = require("./productManager");
const CartManager = require("./cartManager");
const { User } = require("./models"); // Importa el modelo de usuario
const { mongoose } = require("./db"); // Importa la conexión a la base de datos

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const productManager = new ProductManager();
const cartManager = new CartManager();

app.use(express.json());
app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");
app.use(express.static(__dirname + "/public"));

// Configurar express-session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware para verificar la sesión del usuario
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
};

// Middleware para verificar el rol del usuario
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    res.redirect("/profile");
  }
};

// Ruta para el login
app.get("/login", (req, res) => {
  res.render("login");
});

// Ruta para el logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/login");
  });
});

// Ruta para manejar el formulario de login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca el usuario en la base de datos por su correo electrónico
    const user = await User.findOne({ email });

    if (!user) {
      // Si el usuario no existe, devuelve un mensaje de error
      return res.status(401).send("Correo electrónico o contraseña incorrectos");
    }

    // Verifica si la contraseña proporcionada coincide con la almacenada en la base de datos
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Si la contraseña no coincide, devuelve un mensaje de error
      return res.status(401).send("Correo electrónico o contraseña incorrectos");
    }

    // Si las credenciales son válidas, establece la sesión del usuario
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role // Suponiendo que tienes un campo "rol" en tu modelo de usuario
    };

    // Redirige al usuario a la página de productos
    res.redirect("/products");

  } catch (error) {
    // Maneja errores de la base de datos
    console.error("Error de autenticación:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta para la vista de productos (requiere autenticación)
app.get("/products", isAuthenticated, async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("products", { products });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Ruta para la vista de perfil (requiere autenticación)
app.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user });
});

// Otros endpoints y configuraciones...

server.listen(3000, () => {
  console.log(`Server is listening at http://localhost:3000`);
});
