// api/contact.js
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const multer = require('multer');

const upload = multer();

// Configure rate limiting
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 5 requests per hour
    message: 'Too many requests from this IP, please try again later.',
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = async (req, res) => {
    // Apply rate limiting (manually invoke middleware)
    await new Promise((resolve, reject) => {
        contactLimiter(req, res, (err) => (err ? reject(err) : resolve()));
    });

    // Handle only POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Parse form data
    const form = upload.none();
    await new Promise((resolve, reject) => {
        form(req, res, (err) => (err ? reject(err) : resolve()));
    });

    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Prepare email content
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: 'navaneethgade07@gmail.com',
        replyTo: email,
        subject: `New Contact Form Submission: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    };

    // Send email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
    }
};