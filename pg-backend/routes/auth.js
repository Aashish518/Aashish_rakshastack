const express = require("express");
const router = express.Router();

// Middleware to verify token 
const authMiddleware = require("../middleware/authmid");

// Auth controllers 
const { registerUser, loginUser, updateName, sendOTP, forgotPassword, verifyOtp, getUserProfile } = require("../controllers/auth");




// Route to send OTP 
router.post("/send-otp", sendOTP);

// Route to register a new user 
router.post("/register", registerUser);

// Route to login existing user
router.post("/login", loginUser);

// Route to verify OTP
router.post("/verify-otp", verifyOtp);


// Route to update user"s name 
router.put("/update-profile", authMiddleware, updateName);

// Route to handle forgot password
router.post("/forgot-password", forgotPassword);


// Route to get user profile
router.get("/profile", authMiddleware, getUserProfile);


// Export the router to use in main app
module.exports = router;
