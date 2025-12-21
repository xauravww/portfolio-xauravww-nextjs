import { NextRequest, NextResponse } from 'next/server';
import { createQuery } from '@/models/Query';
import nodemailer from 'nodemailer';

// Email validation regex - no changes needed here
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Email sending function
interface EmailOptions {
  to: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.to,
    subject: options.subject,
    html: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Rate limiting - no changes needed here
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3; // Max 3 requests per 15 minutes per IP

function isRateLimited(ip: string) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  const recentRequests = userRequests.filter((timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return true;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return false;
}

// --- Main API Handler ---
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, query } = body;

    // --- Validation (Good as is) ---
    if (!name || !email || !query) {
      return NextResponse.json({ success: false, message: 'Name, email, and message are required' }, { status: 400 });
    }
    if (name.trim().length < 2) {
      return NextResponse.json({ success: false, message: 'Name must be at least 2 characters' }, { status: 400 });
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Please enter a valid email address' }, { status: 400 });
    }
    if (query.trim().length < 10) {
      return NextResponse.json({ success: false, message: 'Message must be at least 10 characters' }, { status: 400 });
    }

    // --- Save to DB (Good as is) ---
    await createQuery({ name, email, message: query, ip });

    // --- ✨ NEW & IMPROVED EMAIL TEMPLATE ✨ ---
    const modernEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Query Confirmation</title>
    <style>
        /* Basic resets for email clients */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
    </style>
</head>
<body style="background-color: #1a1a1a; margin: 0 !important; padding: 20px !important;">
    <!--[if (gte mso 9)|(IE)]>
    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
    <tr>
    <td align="center" valign="top" width="600">
    <![endif]-->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <!-- HEADER -->
        <tr>
            <td align="center" valign="top" style="padding: 20px 0;">
                <h1 style="font-family: Arial, sans-serif; color: #ffffff; margin: 0; font-size: 28px;">Query Received</h1>
            </td>
        </tr>
        <!-- MAIN CONTENT CARD -->
        <tr>
            <td bgcolor="#2a2a2a" align="left" style="padding: 40px; border-radius: 12px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #cccccc;">
                <p style="margin: 0 0 20px 0;">Dear ${name},</p>
                <p style="margin: 0 0 20px 0;">Thank you for reaching out. I have successfully received your query and will get back to you as soon as possible.</p>
                
                <!-- SUBMITTED DETAILS BOX -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                    <tr>
                        <td style="padding: 20px; border: 1px solid #444444; border-radius: 8px;">
                            <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: bold;">Your Submission Details:</p>
                            <p style="margin: 0;"><strong>Name:</strong> ${name}</p>
                            <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 0;"><strong>Query:</strong> ${query}</p>
                        </td>
                    </tr>
                </table>

                <p style="margin: 0 0 30px 0;">Your patience is greatly appreciated.</p>
                <p style="margin: 0;">Best regards,<br>Saurav Maheshwari<br>Full Stack Developer</p>
            </td>
        </tr>
        <!-- CALL TO ACTION BUTTON -->
        <tr>
            <td align="center" style="padding: 30px 0;">
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center" style="border-radius: 8px;" bgcolor="#6a40f7">
                            <a href="${process.env.FRONTEND_URL}" target="_blank" style="font-size: 18px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 8px; padding: 15px 25px; border: 1px solid #6a40f7; display: inline-block; font-weight: bold;">Visit My Portfolio</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <!-- FOOTER -->
        <tr>
            <td align="center" style="padding: 20px; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #888888;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Saurav Maheshwari. All rights reserved.</p>
                <p style="margin: 0;">
                    <a href="mailto:sauravmaheshwari8@gmail.com" style="color: #888888; text-decoration: underline;">sauravmaheshwari8@gmail.com</a> |
                    <a href="https://github.com/xauravww" target="_blank" style="color: #888888; text-decoration: underline;">GitHub</a>
                </p>
            </td>
        </tr>
    </table>
    <!--[if (gte mso 9)|(IE)]>
    </td>
    </tr>
    </table>
    <![endif]-->
</body>
</html>
`;

    // Send the modern confirmation email
    await sendEmail({
      to: email,
      subject: 'Thank You for Your Query!',
      message: modernEmailTemplate,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully! Your query has been recorded.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process query. Please try again later.' },
      { status: 500 }
    );
  }
}
