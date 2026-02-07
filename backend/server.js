const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the PARENT directory (where index.html is)
app.use(express.static(path.join(__dirname, '../'), { index: false }));

// API Routes
app.use('/api', apiRoutes);

// REGISTER User/Admin
app.post('/register', (req, res) => {
    console.log("Register Request Body:", req.body); // DEBUG
    const { role, username, email, password, orgName, govId } = req.body;

    if (role === 'donor') {
        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(sql, [username, email, password], (err, result) => {
            if (err) {
                console.error("Registration Error (Donor):", err); // Log exact error
                return res.status(500).json({ success: false, message: "Registration error: " + err.message });
            }
            res.json({ success: true, message: "Donor registered successfully!" });
        });
    } else if (role === 'organization') {
        const sql = "INSERT INTO admins (org_name, email, gov_id, password) VALUES (?, ?, ?, ?)";
        db.query(sql, [orgName, email, govId, password], (err, result) => {
            if (err) {
                console.error("Registration Error (Organization):", err); // Log exact error
                return res.status(500).json({ success: false, message: "Registration error: " + err.message });
            }
            res.json({ success: true, message: "Organization registered successfully!" });
        });
    } else {
        res.status(400).json({ success: false, message: "Invalid role" });
    }
});

// LOGIN User/Organization
app.post('/login', (req, res) => {
    const { email, password, role } = req.body; // Changed 'username' to 'email' as per requirement

    if (role === 'organization') {
        const sql = "SELECT * FROM admins WHERE email = ? AND password = ?";
        db.query(sql, [email, password], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });

            if (results.length > 0) {
                const admin = results[0];
                // Return necessary info
                res.json({
                    success: true,
                    redirect: 'dashboard.html',
                    user: { username: admin.org_name, email: admin.email, role: 'organization' }
                });
            } else {
                res.status(401).json({ success: false, message: "Invalid Organization Credentials" });
            }
        });
    } else {
        const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        db.query(sql, [email, password], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });

            if (results.length > 0) {
                const user = results[0];
                res.json({
                    success: true,
                    redirect: 'index.html',
                    user: { username: user.username, email: user.email, role: 'donor' }
                });
            } else {
                res.status(401).json({ success: false, message: "Invalid Donor Credentials" });
            }
        });
    }
});

// Forgot Password Mock
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    // In real app, check DB and send email
    res.json({ success: true, message: "If account exists, password reset link sent to " + email });
});

// Explicit routes for HTML pages if needed (though static middleware handles most)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
