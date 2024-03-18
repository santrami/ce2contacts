import nodemailer from 'nodemailer';


// Create a transporter with SMTP credentials
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  }
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