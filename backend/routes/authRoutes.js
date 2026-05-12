const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User'); 

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
                    if (err) return res.status(500).json(err);
                    return res.json(user);
                });
            } else {
                res.status(401).json({ message: "Invalid password" });
            }
        } else {
            res.status(401).json({ message: "User not found or uses Google Login" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
});

// Google auth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('http://localhost:3000');
});

router.get('/current_user', (req, res) => {
    res.send(req.user);
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('http://localhost:3000');
    });
});

module.exports = router;