import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const { email, name, title, ticketId } = await req.json();
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Hospital IT Help Desk" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Ticket Received - Hospital IT Help Desk",
            html: `<p>Dear ${name},</p>
              <p>Thanks for contacting us! We've received your ticket: <strong>${title}</strong>.</p>
              <p>Ticket ID: <code>${ticketId}</code></p>
              <p>We will reach out to you shortly.</p>`,
          });

        return new Response(JSON.stringify({ message: "Email sent" }), { status: 200 });
    } catch (error) {
        console.error("Error rejecting user:", error);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
