import { auth } from "./lib/auth";

const protected_ = [
  "/dashboard",
  "/workstations",
  "/usage",
  "/storage",
  "/billing",
  "/settings",
  "/admin",
  "/onboarding",
];

export default auth((req) => {
  const p = req.nextUrl.pathname;
  if (protected_.some((x) => p === x || p.startsWith(x + "/")) && !req.auth) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", p);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workstations/:path*",
    "/usage/:path*",
    "/storage/:path*",
    "/billing/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/onboarding/:path*",
  ],
};
