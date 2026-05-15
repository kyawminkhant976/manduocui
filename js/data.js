// API-based data management
const API_BASE = window.location.origin;

function normalizeProduct(product = {}) {
    const description = product.description || product.shortDescription || "";
    const shortDescription =
        product.shortDescription || (description.length > 120 ? `${description.slice(0, 117)}...` : description);
    const image = product.image || "";

    return {
        ...product,
        id: String(product.id || ""),
        name: product.name || "Untitled Jade Product",
        price: Number(product.price || 0),
        description,
        shortDescription,
        type: product.type || product.category || product.material || "Jade",
        origin: product.origin || "Myanmar",
        quality: product.quality || product.material || "Burmese Jade",
        image,
        images: Array.isArray(product.images) && product.images.length ? product.images : image ? [image] : []
    };
}

// Get all products from API
async function getProducts() {
    try {
        const response = await fetch(`${API_BASE}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        return products.map(normalizeProduct);
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Get single product by ID
async function findProductById(id) {
    try {
        const response = await fetch(`${API_BASE}/api/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        return normalizeProduct(await response.json());
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// Create new product
async function createProduct(productData) {
    try {
        const response = await fetch(`${API_BASE}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error('Failed to create product');
        return await response.json();
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

// Update product
async function updateProduct(id, productData) {
    try {
        const response = await fetch(`${API_BASE}/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error('Failed to update product');
        return await response.json();
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

// Delete product
async function removeProduct(id) {
    try {
        const response = await fetch(`${API_BASE}/api/products/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return await response.json();
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

// Admin authentication
async function adminLogin(password) {
    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: 'admin', password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('admin_session', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Check if admin is logged in
function isAdminLoggedIn() {
    const session = localStorage.getItem('admin_session');
    if (!session) return false;

    try {
        const data = JSON.parse(session);
        return Boolean(data.token && data.user);
    } catch {
        return false;
    }
}

// Get admin session
function getAdminSession() {
    const session = localStorage.getItem('admin_session');
    return session ? JSON.parse(session) : null;
}

// Logout admin
function adminLogout() {
    localStorage.removeItem('admin_session');
}

export {
    getProducts,
    findProductById,
    createProduct,
    updateProduct,
    removeProduct,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    getAdminSession
};
