/**
 * Simple Express server with authentication for code protection
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

// Configure session middleware
app.use(session({
    secret: 'your-secret-key', // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 3600000 // Session expires after 1 hour
    }
}));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Admin credentials (in a real app, store these securely in a database)
const adminCredentials = {
    username: 'admin',
    // Password: 'DomDom09881131688' (hashed)
    passwordHash: '5f4dcc3b5aa765d61d8327deb882cf99' // MD5 hash (for demo only, use bcrypt in production)
};

// Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Hash the password (use bcrypt in production)
    const passwordHash = crypto.createHash('md5').update(password).digest('hex');
    
    if (username === adminCredentials.username && passwordHash === adminCredentials.passwordHash) {
        req.session.authenticated = true;
        req.session.username = username;
        res.redirect('/admin');
    } else {
        res.redirect('/login?error=1');
    }
});

// Logout endpoint
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Protected admin area
app.get('/admin', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'admin.html'));
});

// Protected source code endpoint
app.get('/source/:file', requireAuth, (req, res) => {
    const file = req.params.file;
    const filePath = path.join(__dirname, 'src', file);
    
    // Validate the file path to prevent directory traversal attacks
    if (!filePath.startsWith(path.join(__dirname, 'src'))) {
        return res.status(403).send('Forbidden');
    }
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        
        res.setHeader('Content-Type', 'text/plain');
        res.send(data);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
