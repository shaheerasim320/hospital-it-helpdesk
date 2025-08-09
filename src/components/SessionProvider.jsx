"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function SessionProvider({ children }) {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/me");
                if (!res.ok) throw new Error("Not authenticated");

                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                logout();
                router.push("/login")
            }
        };

        fetchUser();
    }, [setUser, logout]);

    return children;
}
