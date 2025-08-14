// Import the nodemailer package
const nodemailer = require('nodemailer');

// Create a transporter using Gmail service and environment credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

// Function to send an OTP email
const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email
        to: email, // Recipient email
        subject: 'Pg Finder Verification OTP', // Email subject
        html: `<h3>Your OTP is: <b>${otp}</b></h3>` // HTML body with OTP
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

// Export the sendOTP function to use in your controllers
module.exports = sendOTP;
