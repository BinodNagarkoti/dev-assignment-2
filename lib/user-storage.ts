"use server";
import fs from "node:fs";
import path from "node:path";
import { delay } from "./utils/mock-data";

const filePath = path.join(process.cwd(), "users.json");
export type AdminUser = {
	id: string;
	name: string;
	email: string;
	password: string;
};
export const saveUser = async (userData: AdminUser) => {
	await delay(100);

	let users: AdminUser[] = [];
	if (fs.existsSync(filePath)) {
		const fileData = fs.readFileSync(filePath, "utf-8");
		users = JSON?.parse(fileData);
	}
	users.push(userData);
	fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

export const getUserByEmail = async (email: string) => {
	await delay(100);

	if (fs.existsSync(filePath)) {
		const fileData = fs.readFileSync(filePath, "utf-8");
		const users = JSON.parse(fileData);
		return users.find((user: AdminUser) => user.email === email);
	}
	return null;
};
