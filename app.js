const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const socketIO = require("socket.io");
const ProductManager = require("./productManager");
const CartManager = require("./cartManager"); // Importa el gestor de carrito
const { Message } = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const productManager = new ProductManager();
const cartManager = new CartManager(); // Instancia el gestor de carrito

app.use(express.json());
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main"}));
app.set("view engine", ".hbs");
app.use(express.static(__dirname + "/public"));

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

// Otros endpoints para la gestión del carrito...

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

server.listen(3000, () => {
  console.log(`Server is listening at http://localhost:3000`);
});
