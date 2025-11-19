/**
 * Email utility for sending notifications
 * 
 * TODO: Implement actual email sending using a service like:
 * - Resend (https://resend.com)
 * - SendGrid (https://sendgrid.com)
 * - Nodemailer with SMTP
 */

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const notificationEmail = process.env.NOTIFICATION_EMAIL
  if (!notificationEmail) {
    console.warn('NOTIFICATION_EMAIL not set, skipping email')
    return
  }

  // For now, just log the email
  // In production, implement actual email sending
  console.log('Email would be sent:', {
    to: options.to,
    subject: options.subject,
    text: options.text,
  })

  // Example implementation with Resend:
  // import { Resend } from 'resend'
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'noreply@yourdomain.com',
  //   to: options.to,
  //   subject: options.subject,
  //   text: options.text,
  //   html: options.html,
  // })
}

export async function sendOfferNotification(offerData: {
  offerId: string
  propertyAddress: string
  offerPrice: number
  financingType: string
  buyerEmail?: string
}): Promise<void> {
  const notificationEmail = process.env.NOTIFICATION_EMAIL
  if (!notificationEmail) {
    return
  }

  const emailBody = `
New Offer Created

Offer ID: ${offerData.offerId}
Property: ${offerData.propertyAddress}
Offer Price: $${offerData.offerPrice.toLocaleString()}
Financing Type: ${offerData.financingType}
${offerData.buyerEmail ? `Buyer Email: ${offerData.buyerEmail}` : ''}

Please review and generate the offer letter.
  `.trim()

  await sendEmail({
    to: notificationEmail,
    subject: `New Offer Created - ${offerData.propertyAddress}`,
    text: emailBody,
  })
}

