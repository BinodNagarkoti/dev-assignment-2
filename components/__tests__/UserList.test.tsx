import { beforeEach, describe, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import UserList from "../user-list";

jest.mock("@/components/user-table", () => () => <div>User Table</div>);

jest.mock("@/components/user-table", () => () => <div>User Table</div>);

describe("UserList", () => {
	const mockUseSession = useSession as jest.Mock;

	beforeEach(() => {
		mockUseSession.mockReturnValue({ status: "authenticated" });
	});

	it("should render the user list and add user button when authenticated", () => {
		render(<UserList />);
	});

	it('should open the user form modal in create mode when "Add User" is clicked', () => {
		render(<UserList />);
		fireEvent.click(screen.getByText("Add User"));
	});

	it("should close the modal on cancel", () => {
		render(<UserList />);
		fireEvent.click(screen.getByText("Add User"));

		fireEvent.click(screen.getByText("Cancel"));
	});

	it("should close the modal on success", () => {
		render(<UserList />);
		fireEvent.click(screen.getByText("Add User"));

		fireEvent.click(screen.getByText("Success"));
	});
});
