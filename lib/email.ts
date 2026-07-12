import nodemailer from 'nodemailer'

const GMAIL_USER = process.env.GMAIL_USER || ''
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD || ''

if (!GMAIL_USER || !GMAIL_PASSWORD) {
  console.warn('GMAIL_USER or GMAIL_PASSWORD not set. Email will not be sent.')
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASSWORD,
  },
})

export async function sendBookingEmail(booking: {
  name: string
  email: string
  phone: string
  sessionType: string
  date: string
  message: string
}) {
  if (!GMAIL_USER || !GMAIL_PASSWORD) {
    console.log('Email not sent (missing credentials):', booking)
    return { skipped: true }
  }

  const subject = `New Session Booking — ${booking.name || 'New Client'}`
  const text = `
New booking received:

Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
Session Type: ${booking.sessionType}
Preferred Date: ${booking.date}

Message:
${booking.message}
  `.trim()

  try {
    await transporter.sendMail({
      from: GMAIL_USER,
      to: GMAIL_USER,
      subject,
      text,
      replyTo: booking.email,
    })
    return { ok: true }
  } catch (error) {
    console.error('Failed to send booking email:', error)
    return { ok: false, error }
  }
}
