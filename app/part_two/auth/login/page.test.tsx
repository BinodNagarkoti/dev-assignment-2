import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import LoginPage from "./page";

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

jest.mock("next/navigation", () => ({
	useSearchParams: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
	signIn: jest.fn(),
}));

jest.mock("antd", () => {
	const antd = jest.requireActual("antd");
	return {
		...antd,
		notification: {
			error: jest.fn(),
		},
	};
});

const EMAIL_PLACEHOLDER_REGEX = /enter your email/i;
const PASSWORD_PLACEHOLDER_REGEX = /enter your password/i;
const SIGN_IN_BUTTON_REGEX = /sign in/i;

describe("LoginPage", () => {
	beforeEach(() => {
		(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
		(signIn as jest.Mock).mockClear();
		(require("antd").notification.error as jest.Mock).mockClear();
	});

	it("renders the login form correctly", () => {
		render(<LoginPage />);
		expect(
			screen.getByPlaceholderText(EMAIL_PLACEHOLDER_REGEX)
		).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText(PASSWORD_PLACEHOLDER_REGEX)
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: SIGN_IN_BUTTON_REGEX })
		).toBeInTheDocument();
	});
});
