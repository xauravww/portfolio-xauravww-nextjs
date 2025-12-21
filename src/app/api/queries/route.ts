import { NextResponse } from 'next/server';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { getQueries, deleteQuery } from '@/models/Query';

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

const sendEmail = async (options: { to: string; subject: string; message: string }) => {
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

export async function GET(request: Request) {
  try {
    // Fetch queries from the database (assuming a function getQueries exists)
    const queries = await getQueries(); // Implement this function to fetch queries from your database
    return NextResponse.json(queries, { status: 200 });
  } catch (error) {
    console.error("Error fetching queries:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch queries" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Query ID is required" },
        { status: 400 }
      );
    }

    // Implement the delete logic here (assuming a function deleteQuery exists)
    await deleteQuery(id); // Implement this function to delete the query from your database

    return NextResponse.json(
      { success: true, message: "Query deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting query:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete query" },
      { status: 500 }
    );
  }
}

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
