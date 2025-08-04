"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft, CheckCircle } from "lucide-react";

import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import useAuthStore from "@/store/useAuthStore";

export default function PendingApprovalContent() {
  const { user, setUser } = useAuthStore();
  const [timeElapsed, setTimeElapsed] = useState("0 minutes");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const startTime = new Date();
    const interval = setInterval(() => {
      const now = new Date();
      const diffInMinutes = Math.floor((now - startTime) / (1000 * 60));
      if (diffInMinutes < 60) {
        setTimeElapsed(`${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""}`);
      } else {
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        setTimeElapsed(
          `${hours} hour${hours !== 1 ? "s" : ""}${minutes > 0 ? ` ${minutes} minute${minutes !== 1 ? "s" : ""}` : ""}`
        );
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const refreshUserStatus = async (email) => {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const userData = docSnap.data();

        setUser({
          uid: docSnap.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: userData.status,
          department: userData.department,
        });

        return userData.status;
      }
      return null;
    } catch (err) {
      console.error("Failed to refresh user status", err);
      return null;
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    await refreshUserStatus(user?.email);
    setIsRefreshing(false);
  };

  // ✅ IF APPROVED, show success card
  if (user?.status === "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <Card className="w-full max-w-md text-center shadow-lg border-green-200">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Account Approved</CardTitle>
            <CardDescription className="text-green-600 mt-2">
              Your access has been approved by the admin. You may now sign in and start using the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-6 space-y-3">
              <p className="text-sm text-green-700">Welcome, <strong>{user?.name}</strong>!</p>
              <Link href="/login">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🔁 PENDING UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4">
      <Card className="w-full max-w-md text-center shadow-lg border-yellow-200">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-700">Pending Approval</CardTitle>
          <CardDescription className="text-yellow-600 mt-2">
            Your account is currently under review by the admin.
            <br />
            Last checked: {timeElapsed} ago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 space-y-3">
            <p className="text-sm text-yellow-700">We'll notify you via email once approved.</p>
            <Button
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Check Status"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
