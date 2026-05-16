require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

require('./config/passport');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Body parsing middleware (before CORS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Handling - must be early in middleware chain
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "https://shopping-cart-application-asv5.vercel.app",
            "https://shopping-cart-application-mocha.vercel.app",
            "http://localhost:3000",
            "http://localhost:5000"
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        touchAfter: 24 * 3600
    }),
    cookie: {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("Shopping Cart API is running...");
});

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    retryWrites: true,
    w: 'majority',
    ssl: true,
    authSource: 'admin'
})
    .then(() => console.log("MongoDB connected successfully to Atlas"))
    .catch(err => console.error("MongoDB connection error:", err));

// Local development engine configuration
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;