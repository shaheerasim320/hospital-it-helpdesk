import { cookies } from "next/headers";
import { doc, getDoc } from "firebase/firestore";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/firebase";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const tokenData = await verifyToken(token);
        const { uid } = tokenData;

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }
        const userSnapData = userSnap.data();
        const user = {
            ...userSnapData,
            id: uid,
            role: userSnapData.role === "it" ? "IT Support" : userSnapData.role.charAt(0).toUpperCase() + userSnapData.role.slice(1),
            name: userSnapData.name.split(" ").map(word=>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" "),
        }
        return new Response(JSON.stringify({ user }), { status: 200 });

    } catch (err) {
        console.error("Error fetching user:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
