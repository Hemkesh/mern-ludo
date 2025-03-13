const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const { sessionMiddleware } = require('./config/session');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cookieParser());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.set('trust proxy', 1);

// Only apply CORS in production
if (process.env.NODE_ENV === 'production') {
    const corsOptions = {
        origin: process.env.FRONTEND_URL || 'https://your-render-app.onrender.com',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };
    app.use(cors(corsOptions));
} else {
    // In development, disable CORS by allowing all origins
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Credentials", "true");
        
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }
        next();
    });
}

app.use(sessionMiddleware);

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

require('./config/database')(mongoose);
require('./config/socket')(server);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./build'));
    app.get('*', (req, res) => {
        const indexPath = path.join(__dirname, './build/index.html');
        res.sendFile(indexPath);
    });
}

module.exports = { server };
