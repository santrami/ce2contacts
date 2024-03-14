import nodemailer from 'nodemailer';


// Create a transporter with SMTP credentials
const transporter = nodemailer.createTransport({
  host: 'mail.bsc.es',
  port: 465, // Change port if needed
  secure: true, // Change to true if your server requires a secure connection (SSL/TLS)
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

// Define email options
const mailOptions = {
  from: 'santiago.ramirez@bsc.es',
  to: 'santiago.ramirez@bsc.es',
  subject: 'Test Email',
  text: 'Another test email sent from Nodemailer.',
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
