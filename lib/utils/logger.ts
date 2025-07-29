// lib/utils/logger.ts
export const logger = {
	error: (message: string, error: unknown) => {
		// biome-ignore lint: console is used here as a placeholder for a more robust logging solution.
		console.error(`ERROR: ${message}`, error);
	},
	warn: (message: string, data?: unknown) => {
		// biome-ignore lint: console is used here as a placeholder for a more robust logging solution.
		console.warn(`WARN: ${message}`, data);
	},
	info: (message: string, data?: unknown) => {
		// biome-ignore lint: console is used here as a placeholder for a more robust logging solution.
		console.info(`INFO: ${message}`, data);
	},
	debug: (message: string, data?: unknown) => {
		// Only log debug messages in development
		if (process.env.NODE_ENV === "development") {
			// biome-ignore lint: console is used here as a placeholder for a more robust logging solution.
			console.debug(`DEBUG: ${message}`, data);
		}
	},
};
