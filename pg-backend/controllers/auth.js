const User = require('../models/users');
const EmailVerification = require('../models/EmailVerification');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTP = require('../utils/sendMail');

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Error during registration', error: err.message });
    }
};





// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare input password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d' // Token valid for 1 day
        });

        res.status(200).json({ message: 'Login successful', token });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};




// Update user profile name
exports.updateName = async (req, res) => {
    const name = req.body.name;

    try {
        // Validate name parameter
        if (!name) {
            return res.status(400).json({ message: 'Name is required in params' });
        }

        // Find user by ID (from token) and update name
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Name updated successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Error updating name', error: err.message });
    }
};




// Send OTP for registration or forgot password
exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        // Generate 6-digit OTP and expiry (10 minutes)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Check if user exists → forgot password case
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // For forgot password - save OTP to User record
            existingUser.otp = otp;
            existingUser.otpExpires = otpExpires;
            await existingUser.save();
        } else {
            // New user → registration OTP - save to EmailVerification
            const existing = await EmailVerification.findOne({ email });
            if (existing) await EmailVerification.deleteOne({ email });

            const otpDoc = new EmailVerification({ email, otp, otpExpires });
            await otpDoc.save();

        }

        // Send OTP email (optional actual mail sending)
        await sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent to email' });

    } catch (err) {
        res.status(500).json({ message: 'Error sending OTP', error: err.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // First check if it's a forgot password case (User model)
        const user = await User.findOne({ email });
        if (user && user.otp) {
            if (user.otp !== otp) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }
            if (user.otpExpires < new Date()) {
                return res.status(400).json({ message: 'OTP expired' });
            }
            return res.status(200).json({ message: 'OTP verified successfully', type: 'forgot-password' });
        }

        // Check EmailVerification for registration case
        const otpDoc = await EmailVerification.findOne({ email });
        if (!otpDoc) {
            return res.status(400).json({ message: 'OTP not found' });
        }

        if (otpDoc.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (otpDoc.otpExpires < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        res.status(200).json({ message: 'OTP verified successfully', type: 'registration' });
    } catch (err) {
        res.status(500).json({ message: 'Error verifying OTP', error: err.message });
    }
};




// Reset password using OTP
exports.forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Hash new password and update user record
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Error resetting password', error: err.message });
    }
};



// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};