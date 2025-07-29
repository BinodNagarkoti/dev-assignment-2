import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });
	const pathname = request.nextUrl.pathname;
	// Redirect to login if not authenticated
	// if (!token && pathname !== "/part_two/auth/login") {
	//     return NextResponse.redirect(new URL("/part_two/auth/login", request.url));
	// }

	// Redirect to home if authenticated but trying to access login page
	if (token && pathname === "/part_two/auth/login") {
		return NextResponse.redirect(new URL("/part_two/dashboard", request.url));
	}

	return NextResponse.next();
}

// Define protected routes
export const config = {
	matcher: ["/", "/part_two/:path*", "/dashboard/:path*"],
};
