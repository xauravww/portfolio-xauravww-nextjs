import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email validation regex
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Rate limiting (simple in-memory store - for production use Redis or similar)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3; // Max 3 requests per 15 minutes per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  // Clean old requests
  const recentRequests = userRequests.filter((timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return true;
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, query } = body;

    // Validation
    if (!name || !email || !query) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (query.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email to you (notification)
    const notificationEmail = {
      from: process.env.SMTP_MAIL,
      to: process.env.SMTP_MAIL, // Your email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">New Contact Form Submission</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #4A90E2; margin-top: 10px;">
              ${query.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="text-align: center; color: #666; font-size: 12px;">
            Received on ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    };

    // Confirmation email to user
    const confirmationEmail = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: 'Thank you for your message!',
      html: `
        <html>
          <head>
            <link href="https://fonts.googleapis.com/css2?family=Oregano:ital@0;1&display=swap" rel="stylesheet">
            <style>
              body {
                font-family: 'Oregano', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 10px;
                background-color: #f9f9f9;
              }
              .header {
                text-align: center;
                padding: 10px 0;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                padding: 10px 0;
                font-size: 12px;
                color: #777;
              }
              a {
                color: #1a0dab;
                text-decoration: none;
              }
              a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="font-family: 'Oregano', Arial, sans-serif;">Contact Confirmation</h1>
              </div>
              <p>Dear ${name},</p>
              <p>Thank you for reaching out to me. I have received your message and will get back to you shortly with a detailed response.</p>
              <p>Below are the details of your submission:</p>
              <ul>
                <li><strong>Name</strong>: ${name}</li>
                <li><strong>Email</strong>: ${email}</li>
                <li><strong>Message</strong>: ${query}</li>
              </ul>
              <p>Your patience is greatly appreciated as I work to provide you with the best possible assistance.</p>
              <p>Best regards,<br>
              Saurav Maheshwari<br>
              Full Stack Developer<br>
              <a href="mailto:${process.env.SMTP_MAIL}">${process.env.SMTP_MAIL}</a></p>
              <p>Visit my <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-portfolio.com'}" style="font-family: 'Oregano', Arial, sans-serif;">portfolio</a>.</p>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} <a href="https://github.com/xauravww">xauravww - Github</a> All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(notificationEmail),
      transporter.sendMail(confirmationEmail)
    ]);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully! You should receive a confirmation email shortly.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}