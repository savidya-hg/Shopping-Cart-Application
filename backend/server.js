require('dotenv').config(); 

const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL === '1';

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

if (isProduction) {
    app.set('trust proxy', 1); // Trust Vercel's reverse proxy for secure cookies
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Updated CORS logic to include single unified monorepo domain
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "https://shopping-cart-application-shg.vercel.app",
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

app.use(session({
    secret: process.env.SESSION_SECRET || 'greengrocerysecretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        touchAfter: 24 * 3600
    }),
    cookie: {
        secure: isProduction, // Use secure cookies only in production Vercel
        sameSite: isProduction ? 'none' : 'lax', // Lax is perfect for localhost
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Unified Routing: Mount all routes behind /api for both local and production
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("Shopping Cart API is running...");
});

mongoose.connect(process.env.MONGO_URI, {
    retryWrites: true,
    w: 'majority',
})
.then(() => console.log("MongoDB connected successfully to Atlas"))
.catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;