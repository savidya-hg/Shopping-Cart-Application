const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User'); 

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// manual registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // check for user in db
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // hash password and save
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword,
            role: 'user' // Default role
        });
        
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// manual login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if (user && user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // log the user in using passport session
                req.login(user, (err) => {
                    if (err) {
                        console.error("Login error:", err);
                        return res.status(500).json({ message: "Session error" });
                    }
                    // Ensure session is saved before responding
                    req.session.save((err) => {
                        if (err) {
                            console.error("Session save error:", err);
                            return res.status(500).json({ message: "Session save failed" });
                        }
                        return res.json({ 
                            message: "Login successful", 
                            user: { id: user._id, name: user.name, email: user.email, role: user.role }
                        });
                    });
                });
            } else {
                res.status(401).json({ message: "Invalid password" });
            }
        } else {
            res.status(401).json({ message: "User not found or uses Google Login" });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

// Google auth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect(FRONTEND_URL);
});

router.get('/current_user', (req, res) => {
    res.send(req.user);
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect(FRONTEND_URL);
    });
});

module.exports = router;