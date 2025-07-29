import dayjs from "dayjs";
import type { DashboardStats, User } from "@/lib/types";
// Mock API delay
export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

// Mock users data
export const mockUsers: User[] = [
	{
		id: "1",
		fullName: "John Doe",
		email: "john.doe@example.com",
		phone: "9812345637",
		department: "Engineering",
		position: "Senior Developer",
		address: "showhere",
		dob: dayjs("1992/09/22").toDate(),
		created_at: dayjs("1992/09/22").toDate(),
		status: "active",
	},
	{
		id: "2",
		fullName: "Jane Smith",
		email: "jane.smith@example.com",
		phone: "9823456738",
		department: "Marketing",
		position: "Marketing Manager",
		address: "showhere",
		dob: dayjs("1992/09/22").toDate(),
		created_at: dayjs("1992/09/22").toDate(),
		status: "active",
	},
	{
		id: "3",
		fullName: "Bob Johnson",
		email: "bob.johnson@example.com",
		phone: "9834567839",
		department: "Sales",
		position: "Sales Representative",
		address: "showhere",
		dob: dayjs("1992/09/22").toDate(),
		created_at: dayjs("1992/09/22").toDate(),
		status: "active",
	},
	{
		id: "4",
		fullName: "Alice Wilson",
		email: "alice.wilson@example.com",
		phone: "9845678903",
		department: "HR",
		position: "HR Director",
		address: "showhere",
		dob: dayjs("1992/09/22").toDate(),
		created_at: dayjs("1992/09/22").toDate(),
		status: "active",
	},
	{
		id: "5",
		fullName: "Charlie Brown",
		email: "charlie.brown@example.com",
		phone: "98567-89031",
		department: "Engineering",
		position: "Junior Developer",
		address: "showhere",
		dob: dayjs("1992/09/22").toDate(),
		created_at: dayjs("1992/09/22").toDate(),
		status: "inactive",
	},
	{
		id: "6",
		fullName: "Diana Prince",
		email: "diana.prince@example.com",
		phone: "98678-90132",
		department: "Finance",
		position: "Financial Analyst",
		address: "showhere",
		dob: dayjs("1992/09/22").toDate(),
		created_at: dayjs("1992/09/22").toDate(),
		status: "active",
	},
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
	totalUsers: 6,
	activeUsers: 5,
	newUsersThisMonth: 2,
	inactiveUsers: 2,
	userGrowth: [
		{ month: "Jan", users: 2 },
		{ month: "Feb", users: 3 },
		{ month: "Mar", users: 4 },
		{ month: "Apr", users: 5 },
		{ month: "May", users: 5 },
		{ month: "Jun", users: 6 },
	],
};

// Local storage key
export const USERS_STORAGE_KEY =
	process.env.USERS_STORAGE_KEY ?? "mock_users_data";

// Departments list
// export const departments = [
//     'Engineering',
//     'Marketing',
//     'Sales',
//     'HR',
//     'Finance',
//     'Operations',
//     'Customer Support',
//     'Product',
// ];
