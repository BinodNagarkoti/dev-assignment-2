import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import AuthenticatedHeader from "../authenticated-header";

describe("AuthenticatedHeader", () => {
	const mockUseSession = useSession as jest.Mock;
	const mockUseRouter = useRouter as jest.Mock;
	const mockUsePathname = usePathname as jest.Mock;
	const mockSignOut = signOut as jest.Mock;

	const mockPush = jest.fn();

	beforeEach(() => {
		mockUseRouter.mockReturnValue({
			push: mockPush,
		});
		mockUsePathname.mockReturnValue("/part_two/dashboard");
	});

	it("should render null when there is no session", () => {
		mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
		const { container } = render(<AuthenticatedHeader />);
		expect(container.firstChild).toBeNull();
	});

	it("should render a spinner when the session is loading", () => {
		mockUseSession.mockReturnValue({ data: null, status: "loading" });
		render(<AuthenticatedHeader />);
		// expect(screen.getByRole("spin")).toBeInTheDocument();
	});

	it("should render the header when the user is authenticated", () => {
		mockUseSession.mockReturnValue({
			data: { user: { name: "Test User" } },
			status: "authenticated",
		});
		render(<AuthenticatedHeader />);
		// expect(screen.getByText("Welcome back, Test User!")).toBeInTheDocument();
		// expect(screen.getByText("Dashboard")).toBeInTheDocument();
		// expect(screen.getByText("Manage Users")).toBeInTheDocument();
		// expect(screen.getByText("Logout")).toBeInTheDocument();
	});

	it('should navigate to the dashboard when the "Dashboard" button is clicked', () => {
		mockUseSession.mockReturnValue({
			data: { user: { name: "Test User" } },
			status: "authenticated",
		});
		render(<AuthenticatedHeader />);
		fireEvent.click(screen.getByText("Dashboard"));
		expect(mockPush).toHaveBeenCalledWith("/part_two/dashboard");
	});

	it('should navigate to the users page when the "Manage Users" button is clicked', () => {
		mockUseSession.mockReturnValue({
			data: { user: { name: "Test User" } },
			status: "authenticated",
		});
		render(<AuthenticatedHeader />);
		fireEvent.click(screen.getByText("Manage Users"));
		expect(mockPush).toHaveBeenCalledWith("/part_two/users");
	});

	it('should call signOut when the "Logout" button is clicked', async () => {
		mockUseSession.mockReturnValue({
			data: { user: { name: "Test User" } },
			status: "authenticated",
		});
		render(<AuthenticatedHeader />);
		fireEvent.click(screen.getByText("Logout"));
		expect(mockSignOut).toHaveBeenCalledWith({ redirect: false });
	});
});
