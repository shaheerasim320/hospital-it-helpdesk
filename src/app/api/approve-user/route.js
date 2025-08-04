import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
    });
}

const db = getFirestore();

export async function POST(req) {
    try {
        const { userId } = await req.json();

        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = userDoc.data();

        // ✅ Update Firestore user status
        await db.collection("users").doc(userId).update({
            status: "approved",
            lastUpdated: new Date(),
        });

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
            subject: "Your Account Has Been Approved",
            html: `
          <p>Hi ${user.name},</p>
          <p>Your staff account has been approved. You can now log in to the platform.</p>
          <p><a href="https://localhost:3000/login">Login Now</a></p>
          <p>Best regards,<br/>Hospital IT Team</p>
        `,
        });

        return NextResponse.json({ success: true, name: user.name });
    } catch (error) {
        console.error("Approval Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
