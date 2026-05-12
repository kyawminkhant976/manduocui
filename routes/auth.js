const express = require('express');

const router = express.Router();

// Simple login for now (no real authentication)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Simple check
    if (username === 'admin' && password === 'admin123') {
        res.json({
            token: 'admin-token',
            user: {
                id: '1',
                username: 'admin',
                email: 'admin@example.com',
                role: 'admin'
            }
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;