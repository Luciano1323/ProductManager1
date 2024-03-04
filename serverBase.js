const express = require('express');
const ProductManager = require('./ProductManager');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ServerBase {
    constructor(port, productFilePath, cartFilePath) {
        this.port = port;
        this.productFilePath = productFilePath;
        this.cartFilePath = cartFilePath;
        this.app = express();
        this.productManager = new ProductManager(productFilePath);
        this.setupRoutes();
    }

    setupRoutes() {
        const app = this.app;
        const productManager = this.productManager;

        app.use(express.json());

        // Products Routes
        app.get('/api/products/', (req, res) => {
            try {
                const products = productManager.getProducts();
                res.json(products);
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.get('/api/products/:pid', (req, res) => {
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

        app.post('/api/products', (req, res) => {
            try {
                const { title, description, price, code, stock, category, thumbnails } = req.body;
                const newProduct = productManager.addProduct({ title, description, price, code, stock, category, thumbnails });
                res.status(201).json(newProduct);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        app.put('/api/products/:pid', (req, res) => {
            try {
                const productId = req.params.pid;
                const updatedFields = req.body;
                productManager.updateProduct(productId, updatedFields);
                res.json({ message: 'Product updated successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.delete('/api/products/:pid', (req, res) => {
            try {
                const productId = req.params.pid;
                productManager.deleteProduct(productId);
                res.json({ message: 'Product deleted successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Cart Routes
        app.post('/api/carts/', (req, res) => {
            try {
                const cartId = uuidv4();
                const newCart = { id: cartId, products: [] };
                fs.writeFileSync(this.cartFilePath, JSON.stringify(newCart, null, 2), 'utf8');
                res.status(201).json(newCart);
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.get('/api/carts/:cid', (req, res) => {
            try {
                const cartId = req.params.cid;
                const data = fs.readFileSync(this.cartFilePath, 'utf8');
                const cart = JSON.parse(data);
                if (cart.id === cartId) {
                    res.json(cart.products);
                } else {
                    res.status(404).json({ error: 'Cart not found' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.post('/api/carts/:cid/product/:pid', (req, res) => {
            try {
                const cartId = req.params.cid;
                const productId = req.params.pid;
                const quantity = req.body.quantity || 1;

                let cartData = fs.readFileSync(this.cartFilePath, 'utf8');
                let cart = JSON.parse(cartData);

                if (cart.id !== cartId) {
                    res.status(404).json({ error: 'Cart not found' });
                } else {
                    let productIndex = cart.products.findIndex(product => product.id === productId);

                    if (productIndex === -1) {
                        cart.products.push({ id: productId, quantity });
                    } else {
                        cart.products[productIndex].quantity += quantity;
                    }

                    fs.writeFileSync(this.cartFilePath, JSON.stringify(cart, null, 2), 'utf8');
                    res.status(200).json({ message: 'Product added to cart successfully' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // 404 Route
        app.use((req, res) => {
            res.status(404).json({ error: 'Route not found' });
        });
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is listening at http://localhost:${this.port}`);
        });
    }
}

module.exports = ServerBase;
