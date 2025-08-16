"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import usePreloadData from "@/hooks/usePreloadData";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { user, loading, fetchUser } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      const fetchedUser = await fetchUser();
      if (!fetchedUser) {
        router.replace("/login");
        return;
      }
      setReady(true);
    };

    initializeUser();
  }, [fetchUser, router]);
  usePreloadData();

  if (loading || !ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-medium">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
}
