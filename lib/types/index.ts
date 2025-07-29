export interface User {
	id: string;
	fullName: string;
	email: string;
	address: string;
	phone: string;
	department: string;
	position: string;
	dob: Date;
	status: "active" | "inactive";
	created_at: Date;
}

export interface CreateUserData {
	fullName: string;
	email: string;
	phone: string;
	address: string;
	department: string;
	position: string;
	dob: Date;
	status: "active" | "inactive";
	created_at?: Date;
}

export interface UpdateUserData extends Partial<CreateUserData> {
	id: string;
}

export interface UserFilters {
	search?: string;
	status?: "active" | "inactive" | "all";
	department?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface PaginationData {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
}

export interface DashboardStats {
	totalUsers: number;
	activeUsers: number;
	newUsersThisMonth: number;
	inactiveUsers: number;
	userGrowth?: {
		month: string;
		users: number;
	}[];
}
export interface UsersResponse {
	users: User[];
	pagination: PaginationData;
}
export interface RefreshToken {
	token: string;
	userId: string;
	expires: Date;
}
export interface AccessToken extends RefreshToken {}
