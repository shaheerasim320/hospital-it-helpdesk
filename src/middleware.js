import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

const roleRedirectRules = {
  "/dashboard": {
    block: ["admin"],
    redirectTo: "/admin",
  },
  "/my-tickets": {
    block: ["admin", "it"],
    redirectTo: "/admin",
  },
  "/submit-ticket": {
    block: ["it"],
    redirectTo: "/dashboard",
  },
  "/open-tickets": {
    block: ["admin", "doctor", "nurse", "staff"],
    redirectTo: "/dashboard",
  },
  "/system-status": {
    block: ["admin", "doctor", "nurse", "staff"],
    redirectTo: "/dashboard",
  },
  "/my-assigned-tickets": {
    block: ["doctor", "nurse", "staff"],
    redirectTo: "/dashboard",
  },
  "/admin": {
    block: ["doctor", "nurse", "staff", "it"],
    redirectTo: "/dashboard",
  },
};

async function getUserRole(request) {
  const token = request.cookies.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.role || null;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const userRole = await getUserRole(request);

  if (!userRole && pathname.startsWith("/protected")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const rule = roleRedirectRules[pathname];
  if (rule && rule.block.includes(userRole)) {
    return NextResponse.redirect(new URL(rule.redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/protected/:path*",
    "/dashboard",
    "/my-tickets",
    "/submit-ticket",
    "/open-tickets",
    "/system-status",
    "/my-assigned-tickets",
    "/admin",
  ],
};