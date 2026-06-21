/**
 * Generates the HTML template for booking confirmation emails.
 */
export const getBookingConfirmationEmailTemplate = ({
  userName,
  caregiverName,
  caregiverPhone,
  patientName,
  serviceName,
  bookingDate,
  bookingTime,
  duration,
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmed - ElderCare Connect</title>
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
        .booking-details {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
          border-left: 4px solid #0d9488;
        }
        .booking-details h3 {
          margin-top: 0;
          color: #0f766e;
          font-size: 18px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .detail-row {
          margin-bottom: 10px;
          font-size: 15px;
          display: flex;
          justify-content: space-between;
        }
        .detail-label {
          font-weight: bold;
          color: #475569;
        }
        .detail-value {
          color: #1e293b;
          font-weight: 600;
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
          <h1>Booking Request Accepted!</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Great news! Your booking request has been accepted by the caregiver. They are scheduled to assist you according to the details below.</p>
          
          <div class="booking-details">
            <h3>Booking & Schedule Details</h3>
            <div class="detail-row">
              <span class="detail-label">Caregiver:</span>
              <span class="detail-value">${caregiverName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Caregiver Phone:</span>
              <span class="detail-value">${caregiverPhone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Patient Name:</span>
              <span class="detail-value">${patientName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service Type:</span>
              <span class="detail-value">${serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${bookingDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Start Time:</span>
              <span class="detail-value">${bookingTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Estimated Duration:</span>
              <span class="detail-value">${duration}</span>
            </div>
          </div>
          
          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="btn" target="_blank">View Dashboard Bookings</a>
          </div>
          
          <p>If you need to make any changes or cancel the visit, please coordinate via the dashboard as soon as possible.</p>
          
          <p>Best regards,<br>The ElderCare Connect Team</p>
        </div>
        <div class="footer">
          <p>This is an automated booking confirmation notification from ElderCare Connect.</p>
          <p>&copy; ${new Date().getFullYear()} ElderCare Connect. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
