import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if(path.startsWith("/api/admin")){
    if (session?.role !== "admin") {
      return NextResponse.json({
        error: "Unauthorized",
      },{status: 401});
    }
  }

  // Check if the path starts with /admin
  if (path.startsWith("/admin")) {

    // Redirect to login if not authenticated
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // Redirect to unauthorized page if not an admin
    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}

