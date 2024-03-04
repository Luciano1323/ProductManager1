const ServerBase = require('./serverBase');

const port = 3000;
const filePath = 'productos.json';

const server = new ServerBase(port, filePath);
server.start();
