const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const productManager = require('./productManager');

class ServerBase {
    constructor(port) {
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIO(this.server);

        this.setupExpress();
        this.setupSocketIO();
    }

    setupExpress() {
        this.app.use(express.json());
        this.app.set('view engine', 'handlebars');

        // Configurar el middleware para servir archivos estáticos
        this.app.use(express.static(__dirname + '/public'));

        // Products Routes
        this.app.get('/api/products/', (req, res) => {
            try {
                const products = productManager.getProducts();
                res.json(products);
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        this.app.get('/api/products/:pid', (req, res) => {
            try {
                const productId = req.params.pid;
                const product = productManager.getProductById(productId);
                if (product) {
                    res.json(product);
                } else {
                    res.status(404).json({ error: 'Product not found' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        this.app.post('/api/products', (req, res) => {
            try {
                const { title, description, price, code, stock, category, thumbnails } = req.body;
                const newProduct = productManager.addProduct({ title, description, price, code, stock, category, thumbnails });
                this.io.emit('newProduct', newProduct);
                res.status(201).json(newProduct);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        this.app.put('/api/products/:pid', (req, res) => {
            try {
                const productId = req.params.pid;
                const updatedFields = req.body;
                productManager.updateProduct(productId, updatedFields);
                this.io.emit('updateProducts', productId);
                res.json({ message: 'Product updated successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        this.app.delete('/api/products/:pid', (req, res) => {
            try {
                const productId = req.params.pid;
                productManager.deleteProduct(productId);
                this.io.emit('updateProducts', productId);
                res.json({ message: 'Product deleted successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Ruta para renderizar la vista home.handlebars
        this.app.get('/home', (req, res) => {
            const products = productManager.getProducts();
            res.render('home', { products });
        });

        // 404 Route
        this.app.use((req, res) => {
            res.status(404).json({ error: 'Route not found' });
        });
    }

    setupSocketIO() {
        const io = this.io;

        io.on('connection', (socket) => {
            console.log('Usuario conectado');

            // Escuchar evento 'newProduct' para cuando se agregue un nuevo producto
            socket.on('newProduct', (product) => {
                // Emitir evento 'updateProducts' a todos los clientes
                io.emit('updateProducts', product);
            });

            // Escuchar evento 'deleteProduct' para cuando se elimine un producto
            socket.on('deleteProduct', (productId) => {
                // Emitir evento 'updateProducts' a todos los clientes
                io.emit('updateProducts', productId);
            });

            // Manejar la desconexión de WebSocket
            socket.on('disconnect', () => {
                console.log('Usuario desconectado');
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
