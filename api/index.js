// api/index.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route for form submission
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Too many requests from this IP, please try again later.',
});

const upload = multer();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post('/contact', contactLimiter, upload.none(), (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: 'navaneethgade07@gmail.com',
        replyTo: email,
        subject: `New Contact Form Submission: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    });
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});