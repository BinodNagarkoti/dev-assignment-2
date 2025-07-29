import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	coverageProvider: "v8",
	testEnvironment: "jsdom",
	preset: "ts-jest",
	verbose: true,
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
};

export default createJestConfig(config);
