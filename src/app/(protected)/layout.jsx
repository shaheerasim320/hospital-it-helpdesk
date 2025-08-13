// src/app/(protected)/layout.jsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import usePreloadData from "@/hooks/usePreloadData";

const roleRedirectRules = {
  "/dashboard": {
    block: ["Admin"],
    redirectTo: "/admin",
  },
  "/my-tickets": {
    block: ["Admin","IT Support"],
    redirectTo: "/admin",
  },
  "/submit-ticket": {
    block: ["IT Support"],
    redirectTo: "/dashboard",
  },
  "/open-tickets": {
    block: ["Admin", "Doctor", "Nurse", "Staff"], 
    redirectTo: "/dashboard",
  },
  "/system-status": {
    block: ["Admin", "Doctor", "Nurse", "Staff"],
    redirectTo: "/dashboard",
  },
  "/my-assigned-tickets": {
    block: ["Doctor", "Nurse", "Staff"],
    redirectTo: "/dashboard",
  },
  "/admin": {
    block: ["Doctor", "Nurse", "Staff","IT Support"],
    redirectTo: "/dashboard",
  },
};

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, fetchUser } = useAuthStore();
  const [ready, setReady] = useState(false);
  // const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    (async () => {
      const fetchedUser = await fetchUser();
      if (!fetchedUser) {
        router.replace("/login");
        return;
      }

      const rule = roleRedirectRules[pathname];
      if (rule && rule.block.includes(fetchedUser.role)) {
        router.replace(rule.redirectTo);
        return;
      }

      setReady(true);
    })();
  }, [fetchUser, pathname, router]);

  usePreloadData(user);

  if (loading || !ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-medium">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
}
