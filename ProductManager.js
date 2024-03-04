const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar los productos:', error.message);
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar los productos:', error.message);
        }
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Error: Todos los campos son obligatorios.");
        }

        const id = uuidv4(); // Genera un ID único
        const newProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        const product = this.products.find(product => product.id === productId);

        if (!product) {
            console.error("Error: Producto no encontrado.");
            return null;
        }

        return product;
    }

    updateProduct(productId, updatedFields) {
        const index = this.products.findIndex(product => product.id === productId);

        if (index === -1) {
            throw new Error("Error: Producto no encontrado.");
        }

        this.products[index] = { ...this.products[index], ...updatedFields };
        this.saveProducts();
    }

    deleteProduct(productId) {
        this.products = this.products.filter(product => product.id !== productId);
        this.saveProducts();
    }
}

module.exports = ProductManager;
