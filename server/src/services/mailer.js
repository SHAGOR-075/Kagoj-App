import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn('[Mailer] GMAIL_USER or GMAIL_APP_PASSWORD is not configured in .env');
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export async function sendOtpEmail(toEmail, otpCode, purpose = 'register') {
  const mailer = getTransporter();
  const subject =
    purpose === 'register'
      ? 'Verify your Gmail - Kagoj Quick Notes'
      : 'Password Reset Code - Kagoj Quick Notes';

  const actionText =
    purpose === 'register'
      ? 'verify your Kagoj Quick Notes account'
      : 'reset your Kagoj Quick Notes password';

  const textBody = `Your verification code is ${otpCode}. It expires in 10 minutes. If you did not request this, ignore this email.`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #1c1917;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E7E3DC; padding: 32px;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #1c1917;">কাগজ (Kagoj) Quick Notes</h2>
          <p style="font-size: 14px; color: #57534e; line-height: 1.5;">Use the verification code below to ${actionText}:</p>
          <div style="margin: 24px 0; padding: 18px; background: #FAF8F5; border: 1px dashed #D6D3D1; border-radius: 12px; text-align: center;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #1c1917; font-family: monospace;">${otpCode}</span>
          </div>
          <p style="font-size: 13px; color: #78716c; margin-bottom: 0;">It expires in 10 minutes. If you did not request this, you can safely ignore this email.</p>
        </div>
      </body>
    </html>
  `;

  // Only attempt network sending if credentials are provided
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      await mailer.sendMail({
        from: `"Kagoj Notes" <${process.env.GMAIL_USER}>`,
        to: toEmail,
        subject,
        text: textBody,
        html: htmlBody,
      });
      console.log(`[Mailer] OTP email dispatched to ${toEmail}`);
    } catch (err) {
      console.error(`[Mailer] Error sending email to ${toEmail}:`, err.message);
      // In development or when testing without real SMTP credentials, log warning
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Mailer] Continuing in dev mode. Set valid GMAIL_APP_PASSWORD to deliver real emails.');
      } else {
        throw new Error('Failed to send verification email. Please check server SMTP settings.');
      }
    }
  } else {
    console.warn(`[Mailer] SMTP credentials not set; email sending skipped for ${toEmail}.`);
  }
}
