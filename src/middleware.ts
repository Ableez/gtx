// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// const allowedIPs = ["102.89.22.238", "192.168.203.149"]; // List of allowed
const allowedIPs = process.env.ADMIN_IPADDRESS?.split("/") || [];

function getClientIp(req: NextRequest): string | null {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  const xRealIp = req.headers.get("x-real-ip");

  if (xForwardedFor) {
    // X-Forwarded-For can be a comma-separated list of IPs.
    // The client's IP will be the first one.
    const ips = Array.isArray(xForwardedFor)
      ? xForwardedFor[0]
      : xForwardedFor.split(",")[0];
    return ips.trim();
  }

  if (xRealIp) {
    return Array.isArray(xRealIp) ? xRealIp[0] : xRealIp;
  }

  return null;
}

export function middleware(req: NextRequest) {
  const ip = getClientIp(req);

  console.log("IP:", req.headers);
  if (!ip || !allowedIPs.includes(ip)) {
    console.log(`❌IP ${ip} not allowed`);
    return NextResponse.redirect(new URL("/redirect", req.url));
  }

  console.log(`✅IP ${ip} allowed`);
  return NextResponse.next(); // Allow access if IP matches
}

// Apply middleware to /admin route
export const config = {
  matcher: ["/admin"],
};
