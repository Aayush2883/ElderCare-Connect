/**
 * Generates the HTML template for the email verification mail.
 * @param {string} userName - The name of the user.
 * @param {string} verificationUrl - The URL to verify the email.
 * @returns {string} HTML content
 */
export const getVerificationEmailTemplate = (userName, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - ElderCare Connect</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f4f7f6;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
          padding: 30px 20px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .content {
          padding: 40px 30px;
          color: #334155;
          line-height: 1.6;
        }
        .content p {
          margin: 0 0 20px 0;
          font-size: 16px;
        }
        .btn-container {
          text-align: center;
          margin: 30px 0;
        }
        .btn {
          display: inline-block;
          background-color: #0d9488;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 30px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(13, 148, 136, 0.2);
          transition: background-color 0.2s;
        }
        .btn:hover {
          background-color: #0f766e;
        }
        .note {
          font-size: 14px;
          color: #64748b;
          border-left: 3px solid #cbd5e1;
          padding-left: 15px;
          margin: 25px 0;
        }
        .footer {
          background-color: #f8fafc;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          border-top: 1px solid #f1f5f9;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ElderCare Connect</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Thank you for registering with ElderCare Connect. We are excited to have you on board! To complete your registration and secure your account, please verify your email address by clicking the button below:</p>
          
          <div class="btn-container">
            <a href="${verificationUrl}" class="btn" target="_blank">Verify Email Address</a>
          </div>
          
          <p class="note">
            <strong>Link Expiry:</strong> This verification link will expire in 24 hours. If you did not request this registration, please ignore this email.
          </p>
          
          <p>Best regards,<br>The ElderCare Connect Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply directly to this message.</p>
          <p>&copy; ${new Date().getFullYear()} ElderCare Connect. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
