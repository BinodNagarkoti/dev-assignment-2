import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import UserList from "@/components/user-list";
import { USERS_QUERY_KEY } from "@/lib/hooks/use-users";
import type { UserFilters } from "@/lib/types";
import { getQueryClient } from "@/lib/utils/get-query-client";
import { getUsers } from "@/lib/utils/server-actions";

export default async function page() {
	const queryClient = getQueryClient();
	const filters = {
		status: "all",
	} as UserFilters;

	await queryClient.prefetchQuery({
		queryKey: [USERS_QUERY_KEY],
		queryFn: async () => getUsers(1, 10, filters),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<UserList />
		</HydrationBoundary>
	);
}
