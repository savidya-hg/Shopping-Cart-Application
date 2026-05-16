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

app.use(express.json());

// CORS Handling
app.use(cors({
    origin: "https://shopping-cart-application-asv5.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: true,
        sameSite: 'none', // cookie tracking
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

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
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully to Atlas"))
    .catch(err => console.error("MongoDB connection error:", err));

// Local development engine configuration
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;