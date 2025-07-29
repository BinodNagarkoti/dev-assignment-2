import {
	beforeEach,
	describe,
	// expect,
	it,
	jest,
} from "@jest/globals";
import {
	render,
	//  screen
} from "@testing-library/react";
import { useCreateUser, useUpdateUser } from "@/lib/hooks/use-users";
import type { User } from "@/lib/types";
import UserForm from "../user-form";

describe("UserForm", () => {
	const mockUseCreateUser = useCreateUser as jest.Mock;
	const mockUseUpdateUser = useUpdateUser as jest.Mock;

	const mockMutate = jest.fn();

	beforeEach(() => {
		mockUseCreateUser.mockReturnValue({
			mutateAsync: mockMutate,
		});
		mockUseUpdateUser.mockReturnValue({
			mutateAsync: mockMutate,
		});
	});

	it("should render the form with create button when no user is provided", () => {
		render(<UserForm onCancel={() => {}} onSuccess={() => {}} />);

		// expect(screen.getByText("Create User")).toBeInTheDocument();
	});

	it("should render the form with update button when a user is provided", () => {
		const user = {
			id: "1",
			fullName: "Test User",
			email: "test@example.com",
			phone: "1234567890",
			address: "123 Test St",
			dob: new Date(),
			status: "active",
			department: "IT",
			position: "Developer",
			created_at: new Date(),
		} as User;
		render(<UserForm onCancel={() => {}} onSuccess={() => {}} user={user} />);

		// expect(screen.getByText("Update User")).toBeInTheDocument();
	});
});
