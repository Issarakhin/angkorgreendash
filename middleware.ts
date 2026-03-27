export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/stats/:path*",
    "/api/conversations/:path*",
    "/api/topics/:path*",
    "/api/groups/:path*",
    "/api/export/:path*",
  ],
};
