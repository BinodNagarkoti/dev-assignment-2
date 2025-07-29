import { logger } from "./logger";

export function handleError(error: unknown, context: string) {
	if (error instanceof Error) {
		logger.error(`[${context} Error]:`, error);
		// Optionally send to an error tracking service (e.g., Sentry, Bugsnag)
	} else {
		logger.error(`[${context} Unknown Error]:`, error);
	}
}
