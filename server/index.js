import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// CORS setup for storefront (5173) and admin (5174)
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

// Serve uploads statically
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const DB_FILE = path.join(__dirname, 'db.json');

// Helper to read DB
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        return { products: [], categories: [] };
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    try {
        const parsed = JSON.parse(data || '{}');
        if (Array.isArray(parsed)) {
            // Migration from old array format
            return { products: parsed, categories: [] };
        }
        return { products: parsed.products || [], categories: parsed.categories || [] };
    } catch {
        return { products: [], categories: [] };
    }
};

// Helper to write DB
const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

// ============================================
// PRODUCTS API
// ============================================

// GET all products
app.get('/api/products', (req, res) => {
    try {
        const { products } = readDB();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error reading products', error: error.message });
    }
});

// POST a new product
app.post('/api/products', upload.any(), (req, res) => {
    try {
        const { name, price, category, description, badge, in_stock, featured } = req.body;
        let images = [];

        if (req.files && Array.isArray(req.files)) {
            images = req.files
                .filter(file => file.fieldname === 'images' || file.fieldname === 'images[]')
                .map(file => `/uploads/${file.filename}`);
        }

        const newProduct = {
            id: Date.now().toString(),
            name,
            price: Number(price),
            category,
            description,
            badge: badge || '',
            in_stock: in_stock === 'true' || in_stock === true,
            featured: featured === 'true' || featured === true,
            images: images,
            created_at: new Date().toISOString()
        };

        const db = readDB();
        db.products.push(newProduct);
        writeDB(db);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
});

// PUT update product
app.put('/api/products/:id', upload.any(), (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, description, badge, in_stock, featured, existingImages } = req.body;

        const db = readDB();
        const index = db.products.findIndex((p) => p.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = db.products[index];

        // Parse existingImages from form data (can be string or array of strings)
        let retainedImages = [];
        if (existingImages) {
            retainedImages = Array.isArray(existingImages) ? existingImages : [existingImages];
        }

        // New images uploaded in this request
        let newImages = [];
        if (req.files && Array.isArray(req.files)) {
            newImages = req.files
                .filter(file => file.fieldname === 'images' || file.fieldname === 'images[]')
                .map(file => `/uploads/${file.filename}`);
        }

        const finalImages = [...retainedImages, ...newImages];

        // Delete images that were removed via the UI
        const oldImages = product.images || (product.image_url ? [product.image_url] : []);
        oldImages.forEach(oldImg => {
            if (!finalImages.includes(oldImg)) {
                const oldPath = path.join(__dirname, oldImg);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        });

        const updatedProduct = {
            ...product,
            name: name || product.name,
            price: price ? Number(price) : product.price,
            category: category || product.category,
            description: description || product.description,
            badge: badge !== undefined ? badge : product.badge,
            in_stock: in_stock !== undefined ? (in_stock === 'true' || in_stock === true) : product.in_stock,
            featured: featured !== undefined ? (featured === 'true' || featured === true) : product.featured,
            images: finalImages
        };

        db.products[index] = updatedProduct;
        writeDB(db);

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// DELETE a product
app.delete('/api/products/:id', (req, res) => {
    try {
        const { id } = req.params;
        const db = readDB();
        const index = db.products.findIndex((p) => p.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const [deleted] = db.products.splice(index, 1);
        writeDB(db);

        const oldImages = deleted.images || (deleted.image_url ? [deleted.image_url] : []);
        oldImages.forEach(img => {
            const imagePath = path.join(__dirname, img);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        });

        res.json({ message: 'Product deleted', deletedId: id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// ============================================
// CATEGORIES API
// ============================================

app.get('/api/categories', (req, res) => {
    try {
        const { categories } = readDB();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error reading categories', error: error.message });
    }
});

app.post('/api/categories', upload.single('image'), (req, res) => {
    try {
        const { name } = req.body;
        let image_url = null;

        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        const id = name.toLowerCase().replace(/\s+/g, '-');
        const newCategory = {
            id,
            name,
            image_url,
            created_at: new Date().toISOString()
        };

        const db = readDB();
        // Overwrite if exists
        const existingIndex = db.categories.findIndex(c => c.id === id);
        if (existingIndex >= 0) {
            if (db.categories[existingIndex].image_url && req.file) {
                const oldImagePath = path.join(__dirname, db.categories[existingIndex].image_url);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }
            db.categories[existingIndex] = newCategory;
        } else {
            db.categories.push(newCategory);
        }

        writeDB(db);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error saving category', error: error.message });
    }
});

app.delete('/api/categories/:id', (req, res) => {
    try {
        const { id } = req.params;
        const db = readDB();
        const index = db.categories.findIndex((c) => c.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const [deleted] = db.categories.splice(index, 1);
        writeDB(db);

        if (deleted.image_url) {
            const imagePath = path.join(__dirname, deleted.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
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
    console.log(`Server running on http://localhost:${PORT}`);
});
