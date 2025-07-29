import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "@/lib/user-storage";
import { handleError } from "../utils/error-handler";
import {
	ACCESS_TOKEN_EXPIRY_MS,
	handleInitialSignIn,
	refreshAccessToken,
} from "./config-utils";

export const authConfig: NextAuthOptions = {
	pages: {
		signIn: "/part_two/auth/login",
		signOut: "/part_two/auth/logout",
	},
	providers: [
		Credentials({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					if (!credentials) {
						return null;
					}
					const user = await getUserByEmail(credentials.email);
					if (!user) {
						return null;
					}
					if (user.password === credentials.password) {
						return {
							id: user.id,
							name: user.name,
							email: user.email,
						};
					}
					return null; // Explicitly return null if password does not match
				} catch (error) {
					handleError(error, "Authorization");
					return null;
				}
			},
		}),
	],

	callbacks: {
		async jwt({ token, user, account }) {
			try {
				// Initial sign in
				if (account && user) {
					return await handleInitialSignIn(token, user, account);
				}

				// Return previous token if the access token has not expired yet
				if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
					return token as JWT;
				}

				// Access token has expired, try to update it
				return await refreshAccessToken(token);
			} catch (error) {
				handleError(error, "JWT");
				return {
					...token,
					error: "RefreshAccessTokenError",
				};
			}
		},
		session({ session, token }) {
			try {
				if (token?.user && token?.accessToken) {
					session.user = token.user;
					session.user.id = token.user.id;
					session.accessToken = token.accessToken;
					session.error = token.error;
				}
				return session;
			} catch (error) {
				handleError(error, "Session");
				// Optionally, you can modify the session object to indicate an error
				return {
					...session,
					error: "SessionError",
				};
			}
		},
	},
	session: {
		strategy: "jwt",
		maxAge: ACCESS_TOKEN_EXPIRY_MS,
	},
	secret: process.env.NEXTAUTH_SECRET || "get-next-auth-key",
};
