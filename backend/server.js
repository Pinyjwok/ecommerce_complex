const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');  // Add morgan for request logging

// Load environment variables
dotenv.config();

// Configure global error handling
process.on('uncaughtException', (error) => {
    console.error(' Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

async function startServer() {
    try {
        console.log('\n\n\n');
        console.log('====================================');
        console.log(' Server is starting...');
        console.log('====================================');
        console.log('\n');

        // Detailed dependency logging
        console.log(' Loading dependencies...');
        console.log('Node.js version:', process.version);
        console.log('Express version:', require('express/package.json').version);
        console.log('Mongoose version:', mongoose.version);
        console.log('CORS version:', require('cors/package.json').version);
        console.log('Environment:', process.env.NODE_ENV || 'development');

        // Import route handlers and configurations
        const connectDB = require('./config/db');
        const authRoutes = require('./routes/authRoutes');
        const productRoutes = require('./routes/productRoutes');
        const cartRoutes = require('./routes/cartRoutes');

        // Create Express app
        const app = express();

        // Enhanced logging middleware
        app.use(morgan('combined')); // Detailed request logging
        app.use((req, res, next) => {
            console.log(`🌐 Incoming Request: ${req.method} ${req.path}`);
            console.log('Headers:', req.headers);
            console.log('Body:', req.body);
            
            // Log client IP and connection details
            const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            console.log(`Client IP: ${clientIp}`);
            
            next();
        });

        // Middleware
        app.use(cors({
            origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
            credentials: true,
            optionsSuccessStatus: 200
        }));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Detailed MongoDB connection logging
        console.log(' Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGO_URI.replace(/\/\/.*:(.*)@/, '//***:***@'));

        // Connect to MongoDB with additional error handling
        try {
            await connectDB();
            console.log(' Successfully connected to MongoDB');
        } catch (dbError) {
            console.error(' MongoDB Connection Failed:', dbError);
            throw dbError;
        }

        // Routes
        app.use('/api/auth', authRoutes);
        app.use('/api/products', productRoutes);
        app.use('/api/cart', cartRoutes);

        // Comprehensive health check route
        app.get('/api/health', (req, res) => {
            console.log('🩺 Health check requested');
            res.status(200).json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                serverTime: new Date().toISOString(),
                connections: {
                    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
                }
            });
        });

        // Global error handler with comprehensive logging
        app.use((err, req, res, next) => {
            console.error(' 🚨 Unhandled Error:', {
                message: err.message,
                stack: err.stack,
                method: req.method,
                path: req.path,
                body: req.body,
                headers: req.headers,
                timestamp: new Date().toISOString()
            });
            res.status(500).json({ 
                error: 'Internal Server Error',
                message: err.message || 'Something went wrong',
                timestamp: new Date().toISOString()
            });
        });

        // Start server
        const PORT = process.env.PORT || 3000;
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log('\n====================================');
            console.log(` 🚀 Server running on port ${PORT}`);
            console.log(` 🌐 Listening on http://localhost:${PORT}`);
            console.log(` 🔒 CORS enabled for multiple origins`);
            console.log('====================================\n');
        });

        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            console.log(`Received ${signal}. Closing server...`);
            server.close(() => {
                console.log('HTTP server closed.');
                mongoose.connection.close(false, () => {
                    console.log('MongoDB connection closed.');
                    process.exit(0);
                });
            });
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error(' 🚨 Server Startup Failed:', error);
        process.exit(1);
    }
}

startServer();