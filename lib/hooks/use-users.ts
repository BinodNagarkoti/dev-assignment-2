import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	CreateUserData,
	UpdateUserData,
	User,
	UserFilters,
	UsersResponse,
} from "@/lib/types";
import { handleError } from "../utils/error-handler";
import {
	createUser,
	deleteUser,
	deleteUsers,
	getUser,
	getUsers,
	updateUser,
} from "../utils/server-actions";

// Query key for users, dashboard-stats
export const USERS_QUERY_KEY = "users";
export const DASHBOARD_STATIC_QUERY_KEY = "dashboard-stats";

// Hook to fetch users with pagination and filters
export function useUsers(page: number, pageSize: number, filters: UserFilters) {
	return useQuery<UsersResponse, Error>({
		queryKey: [USERS_QUERY_KEY, page, pageSize, filters],
		queryFn: () => getUsers(page, pageSize, filters),
		placeholderData: (previousData) => previousData, // Keep previous data while fetching new
	});
}

// Hook to fetch a single user by ID
export function useUser(id: string) {
	return useQuery<User | null, Error>({
		queryKey: [USERS_QUERY_KEY, id],
		queryFn: () => getUser(id),
		enabled: !!id, // Only run query if id is provided
	});
}

// Hook to create a new user
export function useCreateUser() {
	const queryClient = useQueryClient();
	return useMutation<User, Error, CreateUserData>({
		mutationFn: (userData: CreateUserData) => createUser(userData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] }); // Invalidate all users queries
		},
		onError: (error) => {
			handleError(error, "CreateUserMutation");
		},
	});
}

// Hook to update an existing user
export function useUpdateUser() {
	const queryClient = useQueryClient();
	return useMutation<User, Error, UpdateUserData>({
		mutationFn: (userData: UpdateUserData) => updateUser(userData),
		onSuccess: (updatedUser) => {
			queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] }); // Invalidate all users queries
			queryClient.invalidateQueries({
				queryKey: [USERS_QUERY_KEY, updatedUser.id],
			}); // Invalidate specific user query
		},
		onError: (error) => {
			handleError(error, "UpdateUserMutation");
		},
	});
}

// Hook to delete a single user
export function useDeleteUser() {
	const queryClient = useQueryClient();
	return useMutation<boolean, Error, string>({
		mutationFn: (id: string) => deleteUser(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] }); // Invalidate all users queries
		},
		onError: (error) => {
			handleError(error, "DeleteUserMutation");
		},
	});
}

// Hook to bulk delete users
export function useDeleteUsers() {
	const queryClient = useQueryClient();
	return useMutation<boolean, Error, string[]>({
		mutationFn: (ids: string[]) => deleteUsers(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] }); // Invalidate all users queries
		},
		onError: (error) => {
			handleError(error, "DeleteUsersMutation");
		},
	});
}
