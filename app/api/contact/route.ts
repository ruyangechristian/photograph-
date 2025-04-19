import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const data = await request.json();

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // Email to you
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'info@iremefocus.com',
      subject: `New Contact Form Submission - ${data.service}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: data.email,
      subject: 'Thank you for contacting us',
      html: `
        <h2>Thank you for your message, ${data.firstName}!</h2>
        <p>We've received your inquiry about ${data.service} and will get back to you soon.</p>
        <p>Here's what you submitted:</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <br>
        <p>Best regards,</p>
        <p>The Ireme Focus Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}