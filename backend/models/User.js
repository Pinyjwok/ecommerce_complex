const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    try {
        console.log('Pre-save hook triggered');
        if (!this.isModified('password')) {
            console.log('Password not modified, skipping hashing');
            return next();
        }
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        console.log('Salt generated:', salt);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password hashed successfully');
        next();
    } catch (error) {
        console.error('Error in pre-save hook:', error);
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        console.log('Comparing passwords...');
        console.log('Candidate password:', candidatePassword);
        console.log('Stored hashed password:', this.password);
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log('Password comparison result:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
};

module.exports = mongoose.model('User', userSchema);
