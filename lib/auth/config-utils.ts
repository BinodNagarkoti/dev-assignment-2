import type { Account, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import { v4 as uuidv4 } from "uuid";
import {
	getAccessTokenByUserId,
	saveAccessToken,
	updateAccessToken,
} from "../access-token-storage";
import {
	getRefreshTokenByUserId,
	saveRefreshToken,
	updateRefreshToken,
} from "../refresh-token-storage";

// a typical setup for refresh and access token expiry in milliseconds
// (5 minutes) (minutes * seconds per minutes * miliseconds per seconds)
export const ACCESS_TOKEN_EXPIRY_MS = 0.5 * 60 * 1000;
// (7 days) (days * hours per days * minutes per hours * seconds per minutes * milisecond milisecond per seconds)
export const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Calculates the expiry time in milliseconds from now.
 * @param milliseconds The number of milliseconds until expiry.
 * @returns The expiry timestamp in milliseconds.
 */
export const calculateExpiry = (milliseconds: number): number =>
	Date.now() + milliseconds;

/**
 * Handles the retrieval or creation of a refresh token for a given user ID.
 * @param userId The ID of the user.
 * @returns The refresh token.
 */
async function getRefreshTokenUseCase(userId: string) {
	const refreshToken = await getRefreshTokenByUserId(userId);
	if (refreshToken) {
		await extendRefreshToken(refreshToken.token, REFRESH_TOKEN_EXPIRY_MS);
		return refreshToken;
	}
	const newRefreshToken = {
		expires: new Date(calculateExpiry(REFRESH_TOKEN_EXPIRY_MS)),
		token: uuidv4(),
		userId,
	};
	await saveRefreshToken(newRefreshToken);
	return newRefreshToken;
}

/**
 * Extends the expiry of a refresh token.
 * @param refreshToken The refresh token string.
 * @param ttl Optional time-to-live in seconds.
 * @returns The updated refresh token.
 */
export async function extendRefreshToken(refreshToken: string, ttl?: number) {
	return await updateRefreshToken(refreshToken, ttl);
}

/**
 * Handles the retrieval or creation of an access token for a given user ID.
 * @param userId The ID of the user.
 * @returns The access token.
 */
async function getAccessTokenUseCase(userId: string) {
	const accessToken = await getAccessTokenByUserId(userId);
	if (accessToken) {
		await extendAccessToken(accessToken.token, ACCESS_TOKEN_EXPIRY_MS);
		return accessToken;
	}
	const newAccessToken = {
		expires: new Date(calculateExpiry(ACCESS_TOKEN_EXPIRY_MS)),
		token: uuidv4(),
		userId,
	};
	await saveAccessToken(newAccessToken);
	return newAccessToken;
}

/**
 * Extends the expiry of an access token.
 * @param accessToken The access token string.
 * @param ttl Optional time-to-live in seconds.
 * @returns The updated access token.
 */
export async function extendAccessToken(accessToken: string, ttl?: number) {
	return await updateAccessToken(accessToken, ttl);
}

/**
 * Refreshes the access token using the refresh token.
 * @param token The current JWT.
 * @returns The updated JWT with a new access token.
 */
export async function refreshAccessToken(token: JWT): Promise<JWT> {
	try {
		if (!token.user?.id) {
			throw new Error("User ID not found in token for refresh.");
		}

		const refreshTokenObject = await getRefreshTokenUseCase(token.user.id);
		const accessTokenObject = await getAccessTokenUseCase(token.user.id);

		return {
			...token,
			accessToken: accessTokenObject?.token,
			refreshToken: refreshTokenObject?.token,
			refreshTokenExpires: calculateExpiry(REFRESH_TOKEN_EXPIRY_MS),
			accessTokenExpires: calculateExpiry(ACCESS_TOKEN_EXPIRY_MS),
		};
	} catch (error: unknown) {
		// console.error("Error refreshing access token:", error); // Use console.error for errors
		return {
			...token,
			error:
				error instanceof Error ? error?.message : "RefreshAccessTokenError",
		};
	}
}

/**
 * Handles the initial sign-in process, setting up access and refresh tokens.
 * @param token The JWT token.
 * @param user The user object.
 * @param account The account object.
 * @returns The updated JWT token.
 */
export async function handleInitialSignIn(
	token: JWT,
	user: User | AdapterUser,
	account: Account | null
): Promise<JWT> {
	const accessTokenObject = account?.access_token
		? {
				token: account.access_token,
				expires: new Date((account?.expires_at ?? 0) * 1000),
				userId: user?.id,
			}
		: await getAccessTokenByUserId(user?.id);
	const refreshTokenObject = account?.refresh_token
		? {
				token: account.refresh_token,
				expires: new Date((account?.expires_at ?? 0) * 1000),
				userId: user?.id,
			}
		: await getRefreshTokenUseCase(user?.id);

	return {
		...token,
		accessToken: accessTokenObject?.token,
		accessTokenExpires: account?.expires_at
			? (account.expires_at ?? 0) * 1000
			: calculateExpiry(ACCESS_TOKEN_EXPIRY_MS), // Convert to milliseconds if from account
		refreshToken: refreshTokenObject?.token,
		refreshTokenExpires: account?.expires_at
			? (account.expires_at ?? 0) * 1000
			: calculateExpiry(REFRESH_TOKEN_EXPIRY_MS), // Convert to milliseconds if from account
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			image: user?.image ?? "",
		},
	} as JWT;
}
