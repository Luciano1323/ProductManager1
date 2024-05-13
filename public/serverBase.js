const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const socketIO = require("socket.io");
const ProductManager = require("../services/ProductManager");
class ServerBase {
  constructor(port, productFilePath, cartFilePath) {
    this.port = port;
    this.productFilePath = productFilePath;
    this.cartFilePath = cartFilePath;
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIO(this.server);

    this.ProductManager = new ProductManager(this.productFilePath, this.cartFilePath);

    this.setupExpress();
    this.setupSocketIO();
  }

  setupExpress() {
    this.app.use(express.json());
    this.app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main"}));
    this.app.set("view engine", ".hbs");

    // Configurar el middleware para servir archivos estáticos
    this.app.use(express.static(__dirname + "/public"));

    // Products Routes
    this.app.get("/api/products", async (req, res) => {
      try {
        const products = await this.ProductManager.getProducts();
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Ruta para renderizar la vista home.handlebars
    this.app.get("/home", async (req, res) => {
      try {
        const products = await this.ProductManager.getProducts();
        res.render("home", { products });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // 404 Route
    this.app.use((req, res) => {
      res.status(404).json({ error: "Route not found" });
    });
  }

  setupSocketIO() {
    const io = this.io;

    io.on("connection", (socket) => {
      console.log("Usuario conectado");

      // Escuchar evento 'newProduct' para cuando se agregue un nuevo producto
      socket.on("newProduct", async (product) => {
        // Emitir evento 'updateProducts' a todos los clientes
        const newProduct = await this.ProductManager.addProduct(product);
        io.emit("updateProducts", newProduct);
      });

      // Escuchar evento 'deleteProduct' para cuando se elimine un producto
      socket.on("deleteProduct", (productId) => {
        // Emitir evento 'updateProducts' a todos los clientes
        this.ProductManager.deleteProduct(productId);
        io.emit("updateProducts");
      });

      // Manejar la desconexión de WebSocket
      socket.on("disconnect", () => {
        console.log("Usuario desconectado");
      });
    });
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`Server is listening at http://localhost:${this.port}`);
    });
  }
}

module.exports = ServerBase;
