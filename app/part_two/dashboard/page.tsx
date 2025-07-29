import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Dashboard from "@/components/dashboard";
import { DASHBOARD_STATIC_QUERY_KEY } from "@/lib/hooks/use-users";
import { getQueryClient } from "@/lib/utils/get-query-client";
import { fetchDashboardStats } from "@/lib/utils/server-actions";
export default async function page() {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: [DASHBOARD_STATIC_QUERY_KEY],
		queryFn: fetchDashboardStats,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Dashboard />
		</HydrationBoundary>
	);
}
