const transporter = require('../services/transporter');

async function sendMail(to, subject, content, options = {}) {
  const { isHtml = false, from = process.env.EMAIL_USER } = options;

  const mailOptions = {
    from,
    to,
    subject,
    ...(isHtml ? { html: content } : { text: content }),
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw new Error('Falha ao enviar e-mail');
  }
}

module.exports = sendMail;
