const ServerBase = require('./serverBase');

const port = 3000;
const productFilePath = 'productos.json';
const cartFilePath = 'carrito.json';

const server = new ServerBase(port, productFilePath, cartFilePath);
server.start();
