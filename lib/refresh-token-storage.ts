"use server";
import fs from "node:fs";
import path from "node:path";
import type { RefreshToken } from "./types/index";
import { delay } from "./utils/mock-data";

const filePath = path.join(process.cwd(), "refresh_token_data.json");

export const saveRefreshToken = async (
	refreshToken: RefreshToken
): Promise<RefreshToken> => {
	await delay(100);

	let refreshTokens: RefreshToken[] = [];
	if (fs.existsSync(filePath)) {
		const fileData = fs.readFileSync(filePath, "utf-8");
		try {
			refreshTokens = JSON.parse(fileData);
		} catch (_e: unknown) {
			// console.error(
			//     "Error parsing refresh token data, initializing with empty array:",
			//     e
			// );
			refreshTokens = [];
		}
	}
	refreshTokens.push(refreshToken);
	fs.writeFileSync(filePath, JSON.stringify(refreshTokens, null, 2));
	return refreshToken;
};

export const getRefreshTokenByUserId = async (
	id: string
): Promise<RefreshToken | null> => {
	await delay(100);

	if (fs.existsSync(filePath)) {
		const fileData = fs.readFileSync(filePath, "utf-8");
		try {
			const refreshTokens: RefreshToken[] = JSON.parse(fileData);
			return refreshTokens.find((rt: RefreshToken) => rt.userId === id) || null;
		} catch (_e: unknown) {
			// console.error("Error parsing refresh token data, returning null:", e);
			return null;
		}
	}
	return null; // Return null instead of throwing for missing file
};

export const getRefreshTokenByToken = async (
	refreshToken: string
): Promise<RefreshToken | null> => {
	await delay(100);

	if (fs.existsSync(filePath)) {
		const fileData = fs.readFileSync(filePath, "utf-8");
		try {
			const refreshTokens: RefreshToken[] = JSON.parse(fileData);
			return (
				refreshTokens.find((rt: RefreshToken) => rt.token === refreshToken) ||
				null
			);
		} catch (_e: unknown) {
			// console.error("Error parsing refresh token data, returning null:", e);
			return null;
		}
	}
	return null; // Return null instead of throwing for missing file
};

export const updateRefreshToken = async (
	refreshToken: string,
	ttl = 20_000
): Promise<RefreshToken | null> => {
	await delay(100);

	if (fs.existsSync(filePath)) {
		const fileData = fs.readFileSync(filePath, "utf-8");
		try {
			const refreshTokens: RefreshToken[] = JSON.parse(fileData);
			const refreshTokenIndex = refreshTokens.findIndex(
				(rt: RefreshToken) => rt.token === refreshToken
			);

			if (refreshTokenIndex === -1) {
				// console.warn(
				//     `Refresh Token with token ${refreshToken} not found for update.`
				// );
				return null;
			}

			const updatedRefreshTokens = [...refreshTokens];
			updatedRefreshTokens[refreshTokenIndex].expires = new Date(
				Date.now() + ttl
			);

			fs.writeFileSync(filePath, JSON.stringify(updatedRefreshTokens, null, 2));
			return updatedRefreshTokens[refreshTokenIndex];
		} catch (_e: unknown) {
			// console.error(
			//     "Error parsing refresh token data during update, returning null:",
			//     e
			// );
			return null;
		}
	}
	return null; // Return null instead of throwing for missing file
};
