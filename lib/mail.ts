import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `https://ce2contacts.earth.bsc.es/reset-password/${token}`;
  await transporter.sendMail({
    from: '"Climateurope2 Contacts" <noreply_ce2contacts@bsc.es>',
    to: email,
    subject: "Password Reset Request for Climateurope2 contacts-app Account",
    html: `
      <p>Dear colleague,</p>
      
      <p>We received a request to reset the password for your ce2contacts account. To proceed with resetting your password, please click the secure link below:</p>
      
      <p><a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
      
      <p>This link will expire in 60 minutes for your security. If you didn't request this password reset, please ignore this email or contact our support team immediately.</p>
      
      <p>For your security:</p>
      <ul>
        <li>Never share this link with anyone</li>
        <li>Our team will never ask for your password</li>
        <li>Access the link only from a trusted device</li>
      </ul>
      
      <p>If you need help, please contact our support team</p>
      
      <p>Best regards,<br>Climateurope2 Team</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetPasswordUrl = `https://ce2contacts.earth.bsc.es/reset-password/${encodeURIComponent(token)}`;
  await transporter.sendMail({
    from: '"Climateurope2 Contacts" <noreply_ce2contacts@bsc.es>',
    to: email,
    subject: "Password Reset Request",
    html: `
      <p>Dear colleague,</p>
      
      <p>We received a request to reset the password for your ce2contacts account. To proceed with resetting your password, please click the secure link below:</p>
      
      <p><a href="${resetPasswordUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
      
      <p>This link will expire in 60 minutes for your security. If you didn't request this password reset, please ignore this email or contact our support team immediately</p>
      
      <p>For your security:</p>
      <ul>
        <li>Never share this link with anyone</li>
        <li>Our team will never ask for your password</li>
        <li>Access the link only from a trusted device</li>
      </ul>
      
      <p>If you need help, please contact our support team</p>
      
      <p>Best regards,<br>Climateurope2 Team</p>
    `,
  });
}

export async function sendNewPasswordEmail(email: string, newPassword: string) {
  await transporter.sendMail({
    from: '"Climateurope2 Contacts" <noreply_ce2contacts@bsc.es>',
    to: email,
    subject: "Your ce2contacts Password Has Been Reset",
    html: `
      <p>Dear colleague,</p>
      
      <p>Your password has been successfully reset for your ce2contacts account.</p>
      
      <p>Your new password is: <strong>${newPassword}</strong></p>
      
      <p>If you did not make this change, please secure your account immediately by:</p>
      <ol>
        <li>Logging into your account</li>
        <li>Changing your password</li>
        <li>Contacting our security team</li>
      </ol>
      
      <p>Best regards,<br>ce2contacts team</p>
    `,
  });
}