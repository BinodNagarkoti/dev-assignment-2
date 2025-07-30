import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "./page";

const loginLinkRegex = /login form/i;
const docLinkRegex = /documentation/i;
describe("Page", () => {
	it("renders the Login Form button and checks its href", () => {
		render(<Page />);
		const loginButton = screen.getByRole("link", { name: loginLinkRegex });
		expect(loginButton).toBeInTheDocument();
		expect(loginButton).toHaveAttribute("href", "/part_two/auth/login");
	});

	it("renders the Documentation button and checks its href", () => {
		render(<Page />);
		const docButton = screen.getByRole("link", { name: docLinkRegex });
		expect(docButton).toBeInTheDocument();
		expect(docButton).toHaveAttribute("href", "/documentation");
	});
});
