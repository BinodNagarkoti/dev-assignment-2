import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
	interface User extends DefaultUser {}

	interface Session {
		user: {
			id: string;
		} & DefaultSession["user"];
		accessToken?: string;
		error?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken?: string;
		refreshToken?: string;
		accessTokenExpires?: number;
		refreshTokenExpires?: number;
		user?: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
		error?: string;
	}
}
