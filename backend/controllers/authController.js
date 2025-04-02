const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register User
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('Received registration request:', { username, email });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        console.log('Checking for existing user:', existingUser ? 'found' : 'not found');
        
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user with plain password - it will be hashed by the pre-save hook
        const user = new User({ username, email, password });
        console.log('Created new user, about to save...');
        await user.save();
        console.log('User saved successfully');
        console.log('Saved user password hash:', user.password);

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        console.log('Token generated successfully');

        res.status(201).json({
            message: 'User registered successfully',
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Received login request for email:', email);
        console.log('Received password:', password);

        // Find user
        const user = await User.findOne({ email });
        console.log('User search result:', user ? 'User found' : 'User not found');
        if (user) {
            console.log('User details:', {
                id: user._id,
                email: user.email,
                passwordHash: user.password
            });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password using the model's method
        console.log('Attempting password comparison...');
        const isMatch = await user.comparePassword(password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        console.log('Login successful, token generated');

        res.json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
