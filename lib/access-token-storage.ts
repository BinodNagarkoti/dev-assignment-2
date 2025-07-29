"use server";
import fs from "node:fs";
import path from "node:path";
import type { AccessToken } from "./types/index";
import { delay } from "./utils/mock-data";

const filePath = path.join(process.cwd(), "access_token_data.json");

export const saveAccessToken = async (
	accessToken: AccessToken
): Promise<AccessToken> => {
	await delay(100);
	let accessTokens: AccessToken[] = [];
	if (fs.existsSync(filePath)) {
		const fileData = fs.readFileSync(filePath, "utf-8");
		try {
			accessTokens = JSON.parse(fileData);
		} catch (_e: unknown) {
			// console.error(
			//     "Error parsing access token data, initializing with empty array:",
			//     e
			// );
			accessTokens = [];
		}
	}
	accessTokens.push(accessToken);
	fs.writeFileSync(filePath, JSON.stringify(accessTokens, null, 2));
	return accessToken;
};

export const getAccessTokenByUserId = async (
	id: string
): Promise<AccessToken | null> => {
	await delay(100);

	if (fs.existsSync(filePath)) {
		const fileData = fs.readFileSync(filePath, "utf-8");
		try {
			const accessTokens: AccessToken[] = JSON.parse(fileData);
			return accessTokens.find((at: AccessToken) => at.userId === id) || null;
		} catch (_e: unknown) {
			// console.error("Error parsing access token data, returning null:", e);
			return null;
		}
	}
	return null;
};

export const getAccessTokenByToken = async (
	accessToken: string
): Promise<AccessToken | null> => {
	await delay(100);

	if (fs.existsSync(filePath)) {
		const fileData = fs.readFileSync(filePath, "utf-8");
		try {
			const accessTokens: AccessToken[] = JSON.parse(fileData);
			return (
				accessTokens.find((at: AccessToken) => at.token === accessToken) || null
			);
		} catch (_e: unknown) {
			// console.error("Error parsing access token data, returning null:", e);
			return null;
		}
	}
	return null;
};

export const updateAccessToken = async (
	accessToken: string,
	ttl = 20_000
): Promise<AccessToken | null> => {
	await delay(100);

	if (fs.existsSync(filePath)) {
		const fileData = fs.readFileSync(filePath, "utf-8");
		try {
			const accessTokens: AccessToken[] = JSON.parse(fileData);
			const accessTokenIndex = accessTokens.findIndex(
				(at: AccessToken) => at.token === accessToken
			);

			if (accessTokenIndex === -1) {
				// console.warn(
				//     `Access Token with token ${accessToken} not found for update.`
				// );
				return null;
			}

			const updatedAccessTokens = [...accessTokens];
			updatedAccessTokens[accessTokenIndex].expires = new Date(
				Date.now() + ttl
			);

			fs.writeFileSync(filePath, JSON.stringify(updatedAccessTokens, null, 2));
			return updatedAccessTokens[accessTokenIndex];
		} catch (_e: unknown) {
			// console.error(
			//     "Error parsing access token data during update, returning null:",
			//     e
			// );
			return null;
		}
	}
	return null;
};
