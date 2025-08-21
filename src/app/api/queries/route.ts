import { NextResponse } from 'next/server';
import axios from 'axios';
import nodemailer from 'nodemailer';

const notionAPIKey = process.env.NOTION_API_KEY;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

const notion = axios.create({
  baseURL: "https://api.notion.com/v1",
  headers: {
    Authorization: `Bearer ${notionAPIKey}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
  },
});

const sendEmail = async (options: any) => {
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

  await transporter.sendMail(mailOptions);
};

export async function POST(request: Request) {
  try {
    const { name, query, email } = await request.json();

    if (!name || !query || !email) {
      return NextResponse.json(
        { success: false, message: "Name, query, and email are required" },
        { status: 400 }
      );
    }

    await notion.post("/pages", {
      parent: { database_id: notionDatabaseId },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Query: { rich_text: [{ text: { content: query } }] },
        Email: { rich_text: [{ text: { content: email } }] },
      },
    });

    const emailOptions = {
      to: email,
      subject: "Thank you for your query!",
      message: `
        <html><body>
          <p>Dear ${name},</p>
          <p>Thank you for reaching out. I have received your query and will get back to you shortly.</p>
          <p>Best regards,<br>Saurav Maheshwari</p>
        </body></html>
      `,
    };

    await sendEmail(emailOptions);

    return NextResponse.json(
      { success: true, message: "Query submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in contact API:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
