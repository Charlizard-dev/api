const nodemailer = require('nodemailer');

let transporter;

// Try OAuth2 first, fall back to basic auth
if (process.env.GMAIL_REFRESH_TOKEN) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.SMTP_USER || 'charlymarchmesina@gmail.com',
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: process.env.GMAIL_ACCESS_TOKEN,
    },
  });
} else {
  // Fallback to basic SMTP (requires app password for Gmail)
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'charlymarchmesina@gmail.com',
      pass: process.env.SMTP_PASS || process.env.PASSWORD,
    },
  });
}

const sendMail = async (to, subject, content, isHtml = false, attachments = []) => {
  try {
    const info = await transporter.sendMail({
      from: `"CityMovers" <${process.env.SMTP_USER || 'your-email@gmail.com'}>`,
      to,
      subject,
      ...(isHtml ? { html: content } : { text: content }),
      attachments,
    });
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendMail;