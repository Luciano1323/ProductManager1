// app.js
const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const socketIO = require("socket.io");
const ProductManager = require("./productManager");
const { Message } = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const productManager = new ProductManager();

app.use(express.json());
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main"}));
app.set("view engine", ".hbs");
app.use(express.static(__dirname + "/public"));

// Products Routes
app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
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

// Implementa las rutas y controladores para el chat

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("sendMessage", async ({ user, message }) => {
    try {
      const newMessage = new Message({ user, message });
      await newMessage.save();
      io.emit("newMessage", newMessage);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

server.listen(3000, () => {
  console.log(`Server is listening at http://localhost:3000`);
});
