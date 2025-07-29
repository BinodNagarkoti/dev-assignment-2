/** biome-ignore-all lint/suspicious/noExplicitAny: <test files> */
/** biome-ignore-all lint/complexity/noCommaOperator: <test files> */
// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import { jest } from "@jest/globals";
import "@testing-library/jest-dom";
import React from "react";

jest.mock("next-auth/react", () => ({
	useSession: jest.fn(),
	signOut: jest.fn(),
}));

jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
	usePathname: jest.fn(),
}));

jest.mock("@/lib/hooks/use-users", () => ({
	useUsers: jest.fn(() => ({
		data: {
			pages: [
				{
					users: [],
					pagination: { total: 0 },
				},
			],
		},
		isLoading: false,
		error: null,
	})),
	useUser: jest.fn(() => ({
		data: {},
		isLoading: false,
		error: null,
	})),
	useCreateUser: jest.fn(() => ({
		mutateAsync: jest.fn(),
	})),
	useUpdateUser: jest.fn(() => ({
		mutateAsync: jest.fn(),
	})),
	useDeleteUser: jest.fn(() => ({
		mutateAsync: jest.fn(),
	})),
	useDeleteUsers: jest.fn(() => ({
		mutateAsync: jest.fn(),
	})),
}));

jest.mock("org-st-demo-ui", () => ({
	CustomFormInput: jest.fn(({ inputProps }) =>
		React.createElement("input", inputProps)
	),
	SubmitButton: jest.fn(({ children }) =>
		React.createElement("button", { type: "submit" }, children)
	),
	useFormHandler: jest.fn((options: any) => ({
		values: options.initialValues,
		isSubmitting: false,
		handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => {
			if (e) {
				e.preventDefault();
			}
			options.onSubmit(options.initialValues);
		},
		setFieldValue: jest.fn(),
		registerForm: jest.fn(),
	})),
}));

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

Object.defineProperty(window, "getComputedStyle", {
	value: () => ({
		getPropertyValue: () => "",
	}),
});

jest.mock("@/lib/utils/server-actions");
