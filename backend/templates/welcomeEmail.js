/**
 * Generates the HTML template for the professional welcome email.
 * @param {string} userName - The name of the user.
 * @returns {string} HTML content
 */
export const getWelcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ElderCare Connect</title>
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
        .features {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
          border-left: 4px solid #0d9488;
        }
        .features h3 {
          margin-top: 0;
          color: #0f766e;
          font-size: 18px;
        }
        .features ul {
          margin: 0;
          padding-left: 20px;
          color: #475569;
        }
        .features li {
          margin-bottom: 10px;
          font-size: 15px;
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
          <h1>Welcome to ElderCare Connect</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Your email has been successfully verified, and your account is now fully active! We are thrilled to welcome you to the ElderCare Connect family.</p>
          
          <p>Our platform is built to connect families with qualified, vetted care professionals, making the process of arranging specialized care for your loved ones easy, secure, and reliable.</p>
          
          <div class="features">
            <h3>Here are a few things you can do now:</h3>
            <ul>
              <li><strong>Complete Your Profile:</strong> Tell us more about your care requirements.</li>
              <li><strong>Browse Services:</strong> Explore specialized services like Nursing Care, Physical Therapy, and Daily Attendants.</li>
              <li><strong>Book a Caregiver:</strong> Find and schedule qualified caregivers matching your needs.</li>
              <li><strong>Manage Bookings:</strong> Keep track of ongoing, completed, and upcoming bookings easily.</li>
            </ul>
          </div>
          
          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="btn" target="_blank">Go to Dashboard</a>
          </div>
          
          <p>If you have any questions or need assistance setting up your profile, please don't hesitate to reach out to our support team.</p>
          
          <p>Best regards,<br>The ElderCare Connect Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to you because you successfully registered and verified your account on ElderCare Connect.</p>
          <p>&copy; ${new Date().getFullYear()} ElderCare Connect. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
