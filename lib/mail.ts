// lib/mail.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user:process.env.EMAIL_SERVER_USER,
    pass:process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `https://ce2contacts.earth.bsc.es/reset-password/${token}`; // Nowy format URL
  await transporter.sendMail({
    from: '"Climate Europe 2 internal" <santiago.ramirez@bsc.es>',
    to: email,
    subject: "Change your password",
    html: `Please click on the following link to change your password: <a href="${verificationUrl}">${verificationUrl}</a>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetPasswordUrl = `https://ce2contacts.earth.bsc.es/reset-password/${encodeURIComponent(token)}`;
  await transporter.sendMail({
    from: '"Climateurope2" <santiago.ramirez@bsc.es>',
    to: email,
    subject: "Password Reset Request",
    html: `We received a request to reset your password for our app. Please click on the following link to reset your password: <a href="${resetPasswordUrl}">Reset Password</a>. If you did not request a password reset, please ignore this email.`,
  });
}

export async function sendNewPasswordEmail(email: string, newPassword: string) {
  await transporter.sendMail({
    from: '"Climateurope2" <santiago.ramirez@bsc.es>',
    to: email,
    subject: "Your New Password",
    html: `Your password has been reset. Here is your new password: <strong>${newPassword}</strong>. It is recommended to change this password after logging in.`,
  });
}