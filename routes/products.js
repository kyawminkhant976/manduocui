const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

const DATA_FILE = path.join(__dirname, '..', 'data', 'products.json');

// Helper function to read products
async function readProducts() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper function to write products
async function writeProducts(products) {
    await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));
}

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category, featured, search } = req.query;
        let products = await readProducts();

        if (category) {
            products = products.filter(p => p.category === category);
        }
        if (featured === 'true') {
            products = products.filter(p => p.featured);
        }
        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower) ||
                p.material.toLowerCase().includes(searchLower)
            );
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const product = products.find(p => p.id === req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create product
router.post('/', async (req, res) => {
    try {
        const products = await readProducts();
        const newProduct = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        products.push(newProduct);
        await writeProducts(products);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const index = products.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }
        products[index] = { ...products[index], ...req.body };
        await writeProducts(products);
        res.json(products[index]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const index = products.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }
        products.splice(index, 1);
        await writeProducts(products);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;