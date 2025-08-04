import { db } from "@/app/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const { userId } = await req.json();

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return new Response(JSON.stringify({ error: "User not found." }), { status: 404 });
        }

        const user = userSnap.data();

        await updateDoc(userRef, { status: "pending" });

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
            from: `"Admin Team" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Account Rejected",
            html: `<p>Dear ${user.name},</p><p>Your staff account has been rejected or revoked. Please contact support if you believe this was a mistake.</p><p>Best regards,<br/>Hospital IT Team</p>`,
        });

        return new Response(JSON.stringify({ name: user.name }), { status: 200 });
    } catch (error) {
        console.error("Error rejecting user:", error);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
