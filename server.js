// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const rateLimit = require('express-rate-limit');
const multer = require('multer'); // Add multer
const app = express();

// Configure multer to parse form data (we're not handling file uploads, so use memory storage)
const upload = multer();

// Serve static files (your website's HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Configure rate limiting (e.g., max 5 requests per hour per IP)
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 5 requests per hour
    message: 'Too many requests from this IP, please try again later.',
});

// Configure Nodemailer (using Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Route to handle form submission with rate limiting
app.post('/contact', contactLimiter, upload.none(), (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Prepare email content
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // Use the authenticated Gmail user
        to: 'navaneethgade07@gmail.com',
        replyTo: email, // Allow replies to go to the user's email
        subject: `New Contact Form Submission: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});