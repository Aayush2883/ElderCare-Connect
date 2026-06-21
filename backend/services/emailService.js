import nodemailer from 'nodemailer';
import { getVerificationEmailTemplate } from '../templates/verificationEmail.js';
import { getWelcomeEmailTemplate } from '../templates/welcomeEmail.js';
import { getBookingConfirmationEmailTemplate } from '../templates/bookingConfirmationEmail.js';

/**
 * Checks if the email service configuration variables are present in env.
 * @returns {boolean} true if configured, false otherwise
 */
export const isEmailServiceConfigured = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  return !!(host && port && user && pass);
};

/**
 * Creates and returns a Nodemailer transporter if config is present.
 * Returns null if SMTP configuration is incomplete.
 */
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Sends a verification email to a newly registered user.
 * Falls back to console logging in development environments if SMTP is unconfigured.
 * 
 * @param {object} user - The mongoose user instance.
 * @param {string} token - The secure verification token.
 */
export const sendVerificationEmail = async (user, token) => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const verificationUrl = `${backendUrl}/api/auth/verify-email/${token}`;
  const htmlContent = getVerificationEmailTemplate(user.name, verificationUrl);
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || '"ElderCare Connect" <noreply@eldercareconnect.com>',
    to: user.email,
    subject: 'Verify Your Email Address - ElderCare Connect',
    html: htmlContent,
  };

  if (!transporter) {
    console.log('\n==================================================');
    console.log('📬 [EMAIL SERVICE FALLBACK - NO SMTP CONFIGURED]');
    console.log(`To: ${user.email}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log('==================================================\n');
    return;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Verification email sent successfully to ${user.email}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send verification email to ${user.email}:`, error.message);
    // In local development, fail gracefully rather than crashing the request if email fails
    if (process.env.NODE_ENV !== 'production') {
      console.log('📬 Verification link for developer bypass:', verificationUrl);
    } else {
      throw error;
    }
  }
};

/**
 * Sends a professional welcome email to a verified user.
 * Falls back to console logging in development environments if SMTP is unconfigured.
 * 
 * @param {object} user - The mongoose user instance.
 */
export const sendWelcomeEmail = async (user) => {
  const htmlContent = getWelcomeEmailTemplate(user.name);
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || '"ElderCare Connect" <noreply@eldercareconnect.com>',
    to: user.email,
    subject: 'Welcome to ElderCare Connect!',
    html: htmlContent,
  };

  if (!transporter) {
    console.log('\n==================================================');
    console.log('🎉 [EMAIL SERVICE FALLBACK - NO SMTP CONFIGURED]');
    console.log(`To: ${user.email}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log('Status: Welcomed!');
    console.log('==================================================\n');
    return;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Welcome email sent successfully to ${user.email}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${user.email}:`, error.message);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
};

/**
 * Sends a booking confirmation email to the user.
 * 
 * @param {object} user - The mongoose user instance of the patient/family who booked.
 * @param {object} details - The booking schedule and provider information.
 */
export const sendBookingConfirmationEmail = async (user, details) => {
  const htmlContent = getBookingConfirmationEmailTemplate({
    userName: user.name,
    caregiverName: details.caregiverName,
    caregiverPhone: details.caregiverPhone,
    patientName: details.patientName,
    serviceName: details.serviceName,
    bookingDate: details.bookingDate,
    bookingTime: details.bookingTime,
    duration: details.duration,
  });
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || '"ElderCare Connect" <noreply@eldercareconnect.com>',
    to: user.email,
    subject: `Booking Confirmed with ${details.caregiverName} - ElderCare Connect`,
    html: htmlContent,
  };

  if (!transporter) {
    console.log('\n==================================================');
    console.log('📅 [EMAIL SERVICE FALLBACK - NO SMTP CONFIGURED]');
    console.log(`To: ${user.email}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log('Details:');
    console.log(`  Caregiver: ${details.caregiverName} (Phone: ${details.caregiverPhone})`);
    console.log(`  Patient: ${details.patientName}`);
    console.log(`  Service: ${details.serviceName}`);
    console.log(`  Date/Time: ${details.bookingDate} @ ${details.bookingTime} (${details.duration})`);
    console.log('==================================================\n');
    return;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Booking confirmation email sent successfully to ${user.email}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send booking confirmation email to ${user.email}:`, error.message);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
};

