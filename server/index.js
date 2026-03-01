import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup for storefront (5173) and admin (5174)
// Adding the vercel URLs to allow production requests
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://bloomnbutter.vercel.app',
        'https://bloomnbutter-nine.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

// ============================================
// CLOUDINARY CONFIGURATION
// ============================================
// The Cloudinary library automatically uses the CLOUDINARY_URL from your .env
cloudinary.config();

// Define Storage for Products
const storageProducts = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bloom_and_butter/products', // Cloudinary folder name
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

// Define Storage for Categories
const storageCategories = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bloom_and_butter/categories', // Cloudinary folder name
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const uploadProduct = multer({ storage: storageProducts });
const uploadCategory = multer({ storage: storageCategories });


// ============================================
// DATABASE INITIALIZATION
// ============================================
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                category VARCHAR(255) NOT NULL,
                description TEXT,
                badge VARCHAR(255),
                in_stock BOOLEAN DEFAULT TRUE,
                featured BOOLEAN DEFAULT FALSE,
                images JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Database initialized successfully.");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
};

initDB();


// ============================================
// PRODUCTS API
// ============================================

// GET all products
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error reading products', error: error.message });
    }
});

// POST a new product
app.post('/api/products', uploadProduct.any(), async (req, res) => {
    try {
        const { name, price, category, description, badge, in_stock, featured } = req.body;
        let images = [];

        if (req.files && Array.isArray(req.files)) {
            images = req.files
                .filter(file => file.fieldname === 'images' || file.fieldname === 'images[]')
                .map(file => file.path); // file.path stores the Cloudinary secure URL
        }

        const newId = Date.now().toString();
        const inStockBool = in_stock === 'true' || in_stock === true;
        const featuredBool = featured === 'true' || featured === true;

        const result = await pool.query(
            `INSERT INTO products (id, name, price, category, description, badge, in_stock, featured, images) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [newId, name, Number(price), category, description, badge || '', inStockBool, featuredBool, JSON.stringify(images)]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
});

// PUT update product
app.put('/api/products/:id', uploadProduct.any(), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, description, badge, in_stock, featured, existingImages } = req.body;

        // Fetch current product to check existence
        const currentResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (currentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const currentProduct = currentResult.rows[0];

        // Parse existingImages from form data (can be string or array of strings)
        let retainedImages = [];
        if (existingImages) {
            retainedImages = Array.isArray(existingImages) ? existingImages : [existingImages];
        }

        // New images uploaded to Cloudinary in this request
        let newImages = [];
        if (req.files && Array.isArray(req.files)) {
            newImages = req.files
                .filter(file => file.fieldname === 'images' || file.fieldname === 'images[]')
                .map(file => file.path); // Cloudinary URL
        }

        const finalImages = [...retainedImages, ...newImages];

        // Ensure fields have fallback values to currentProduct if not provided
        const updatedName = name || currentProduct.name;
        const updatedPrice = price ? Number(price) : currentProduct.price;
        const updatedCategory = category || currentProduct.category;
        const updatedDesc = description || currentProduct.description;
        const updatedBadge = badge !== undefined ? badge : currentProduct.badge;
        const updatedInStock = in_stock !== undefined ? (in_stock === 'true' || in_stock === true) : currentProduct.in_stock;
        const updatedFeatured = featured !== undefined ? (featured === 'true' || featured === true) : currentProduct.featured;

        const updateResult = await pool.query(
            `UPDATE products 
             SET name=$1, price=$2, category=$3, description=$4, badge=$5, in_stock=$6, featured=$7, images=$8 
             WHERE id=$9 RETURNING *`,
            [updatedName, updatedPrice, updatedCategory, updatedDesc, updatedBadge, updatedInStock, updatedFeatured, JSON.stringify(finalImages), id]
        );

        res.json(updateResult.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// DELETE a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted', deletedId: id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// ============================================
// CATEGORIES API
// ============================================

app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error reading categories', error: error.message });
    }
});

app.post('/api/categories', uploadCategory.single('image'), async (req, res) => {
    try {
        const { name } = req.body;
        let image_url = null;

        if (req.file) {
            image_url = req.file.path; // Cloudinary secure URL
        }

        const id = name.toLowerCase().replace(/\s+/g, '-');

        // Insert or update category
        const result = await pool.query(
            `INSERT INTO categories (id, name, image_url) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (id) DO UPDATE 
             SET name = $2, image_url = COALESCE($3, categories.image_url)
             RETURNING *`,
            [id, name, image_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error saving category', error: error.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted', deletedId: id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('Multer Error:', err);
        return res.status(400).json({ message: 'Multer Error', error: err.message, field: err.field });
    }
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
