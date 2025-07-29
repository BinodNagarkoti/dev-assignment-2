import { v4 as uuidv4 } from "uuid";
import type {
	CreateUserData,
	DashboardStats,
	UpdateUserData,
	User,
	UserFilters,
	UsersResponse,
} from "@/lib/types";
import { handleError } from "./error-handler";
import { logger } from "./logger";
import { delay, mockUsers, USERS_STORAGE_KEY } from "./mock-data";

// Get all users with filtering and pagination
export async function getUsers(
	page = 1,
	pageSize = 10,
	filters: UserFilters = {}
): Promise<UsersResponse> {
	try {
		await delay(300); // Simulate API delay

		let users = await getStoredUsers();

		// Apply filters
		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			users = users.filter(
				(user) =>
					user.fullName.toLowerCase().includes(searchLower) ||
					user.email.toLowerCase().includes(searchLower) ||
					user.department?.toLowerCase().includes(searchLower) ||
					user.position?.toLowerCase().includes(searchLower)
			);
		}

		if (filters.status && filters.status !== "all") {
			users = users.filter((user) => user.status === filters.status);
		}

		if (filters.department) {
			users = users.filter((user) => user.department === filters.department);
		}

		// Apply pagination
		const total = users.length;
		const totalPages = Math.ceil(total / pageSize);
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		const paginatedUsers = users.slice(startIndex, endIndex);

		return {
			users: paginatedUsers,
			pagination: {
				page,
				pageSize,
				total,
				totalPages,
			},
		};
	} catch (error) {
		handleError(error, "GetUsers");
		return {
			users: [],
			pagination: {
				page: 1,
				pageSize: 10,
				total: 0,
				totalPages: 0,
			},
		};
	}
}

// Get single user by ID
export async function getUser(id: string): Promise<User | null> {
	try {
		await delay(200);

		const users = await getStoredUsers();
		return users.find((user) => user.id === id) || null;
	} catch (error) {
		handleError(error, "GetUser");
		return null;
	}
}

// Create new user
export async function createUser(userData: CreateUserData): Promise<User> {
	try {
		await delay(500);

		const users = await getStoredUsers();
		const newUser: User = {
			...userData,
			created_at: new Date(),
			id: uuidv4(),
		};

		const updatedUsers = [...users, newUser];
		storeUsers(updatedUsers);

		return newUser;
	} catch (error) {
		handleError(error, "CreateUser");
		throw new Error("Failed to create user.");
	}
}

// Update existing user
export async function updateUser(userData: UpdateUserData): Promise<User> {
	try {
		await delay(500);

		const users = await getStoredUsers();
		const userIndex = users.findIndex((user) => user.id === userData.id);

		if (userIndex === -1) {
			throw new Error("User not found");
		}

		const updatedUser: User = {
			...users[userIndex],
			...userData,
		};

		const updatedUsers = [...users];
		updatedUsers[userIndex] = updatedUser;
		storeUsers(updatedUsers);

		return updatedUser;
	} catch (error) {
		handleError(error, "UpdateUser");
		throw new Error("Failed to update user.");
	}
}

// Delete user
export async function deleteUser(id: string): Promise<boolean> {
	try {
		await delay(300);

		const users = await getStoredUsers();
		const filteredUsers = users.filter((user) => user.id !== id);

		if (filteredUsers.length === users.length) {
			throw new Error("User not found");
		}

		storeUsers(filteredUsers);
		return true;
	} catch (error) {
		handleError(error, "DeleteUser");
		return false;
	}
}

// Bulk delete users
export async function deleteUsers(ids: string[]): Promise<boolean> {
	try {
		await delay(500);

		const users = await getStoredUsers();
		const filteredUsers = users.filter((user) => !ids.includes(user.id));

		storeUsers(filteredUsers);
		return true;
	} catch (error) {
		handleError(error, "DeleteUsers");
		return false;
	}
}

// Get users from localStorage or fallback to mock data
export async function getStoredUsers(): Promise<User[]> {
	try {
		await delay(100);

		if (typeof window === "undefined") {
			return mockUsers;
		}

		const stored = localStorage.getItem(USERS_STORAGE_KEY);
		if (stored) {
			const parsedUsers = JSON.parse(stored);
			// Convert date strings back to Date objects
			return parsedUsers.map((user: User) => ({
				...user,
				created_at: new Date(user.created_at), // Convert date string back to Date object
			}));
		}
		// Initialize with mock data
		storeUsers(mockUsers);
		return mockUsers;
	} catch (error) {
		handleError(error, "GetStoredUsers");
		// Fallback to mock data if localStorage fails
		return mockUsers;
	}
}

// Store users to localStorage
export async function storeUsers(users: User[]): Promise<void> {
	try {
		await delay(100);

		if (typeof window === "undefined") {
			logger.warn(
				"Attempted to store users on server-side. Operation skipped."
			);
			return;
		}

		localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
	} catch (error) {
		handleError(error, "StoreUsers");
	}
}

// Mock API function
export async function fetchDashboardStats(): Promise<DashboardStats> {
	try {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Get real user count from stored data
		const users = await getStoredUsers();
		const activeUsers = users.filter((user) => user.status === "active").length;
		const inactiveUsers = users.filter(
			(user) => user.status === "inactive"
		).length;
		const usersGroupedByMonth = users.reduce(
			(acc: Record<string, User[]>, user) => {
				const monthKey = user.created_at.toISOString().substring(0, 7); // Extract YYYY-MM
				if (!acc[monthKey]) {
					acc[monthKey] = [];
				}
				acc[monthKey].push(user);
				return acc;
			},
			{}
		);

		const currentMonth = new Date().toISOString().substring(0, 7);
		const newUsersThisMonth = usersGroupedByMonth[currentMonth]
			? usersGroupedByMonth[currentMonth].length
			: 0;

		const userGrowth = Object.entries(usersGroupedByMonth).map(
			([month, usersInMonth]) => ({
				month,
				users: (usersInMonth || []).length,
			})
		);

		return {
			totalUsers: users.length,
			activeUsers,
			inactiveUsers,
			newUsersThisMonth,
			userGrowth,
		};
	} catch (error) {
		handleError(error, "FetchDashboardStats");
		// Return a default or empty state in case of an error
		return {
			totalUsers: 0,
			activeUsers: 0,
			inactiveUsers: 0,
			newUsersThisMonth: 0,
			userGrowth: [],
		};
	}
}
