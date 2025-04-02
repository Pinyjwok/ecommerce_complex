const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGO_URI);
        
        // Enhanced connection options for stability
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            serverSelectionTimeoutMS: 10000, // Increased timeout to 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
            connectTimeoutMS: 10000, // Connection timeout of 10 seconds
            retryWrites: true,
            w: 'majority' // Write to majority of replica set
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log('MongoDB database:', conn.connection.name);
        
        // Event listeners for connection state
        mongoose.connection.on('connected', () => {
            console.log('✅ Mongoose connected to database');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ Mongoose disconnected from database');
        });

        // Ensure we're using the correct database
        let db = mongoose.connection.db;
        if (db.databaseName !== 'ecommerce') {
            console.log('🔄 Switching to ecommerce database');
            mongoose.connection.useDb('ecommerce');
            db = mongoose.connection.db;
        }
        
        console.log('✅ Connected to ecommerce database');
        return conn;
    } catch (error) {
        console.error('\n❌ MongoDB Connection Error:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('MongoDB URI:', process.env.MONGO_URI);
        console.error('❌ Failed to connect to MongoDB');
        console.error('❌ Server will exit now');
        console.log('\n====================================');
        throw error; // Rethrow to be caught by caller
    }
};

module.exports = connectDB;