"use client";
import {
	TeamOutlined,
	UsergroupAddOutlined,
	UsergroupDeleteOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Column, type ColumnConfig } from "@ant-design/plots";
import { useQuery } from "@tanstack/react-query";
import { Col, Row, Spin, Statistic } from "antd";
import { useSession } from "next-auth/react";
import { FlexbleCard } from "org-st-demo-ui";
import { DASHBOARD_STATIC_QUERY_KEY } from "@/lib/hooks/use-users";
import { fetchDashboardStats } from "@/lib/utils/server-actions";

function Dashboard() {
	const { data: _, status } = useSession();
	const {
		data: stats,
		isLoading,
		error,
	} = useQuery({
		queryKey: [DASHBOARD_STATIC_QUERY_KEY],
		queryFn: fetchDashboardStats,
	});

	if (status === "loading") {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
				}}
			>
				<Spin size="large" />
			</div>
		);
	}
	const config = {
		data: stats?.userGrowth ?? [],
		xField: "month",
		yField: "users",
	} as ColumnConfig;
	return (
		<div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
			{/* Stats Cards */}
			{(() => {
				if (isLoading) {
					return (
						<div style={{ textAlign: "center", padding: "50px" }}>
							<Spin size="large" />
						</div>
					);
				}
				if (error) {
					return (
						<div style={{ textAlign: "center", padding: "50px" }}>
							<p>Error loading dashboard data</p>
						</div>
					);
				}
				return (
					<>
						<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
							<Col lg={6} sm={12} xs={24}>
								<FlexbleCard>
									<Statistic
										prefix={<TeamOutlined />}
										title="Total Users"
										value={stats?.totalUsers}
										valueStyle={{ color: "#1890ff" }}
									/>
								</FlexbleCard>
							</Col>
							<Col lg={6} sm={12} xs={24}>
								<FlexbleCard>
									<Statistic
										prefix={<UserOutlined />}
										title="Active Users"
										value={stats?.activeUsers}
										valueStyle={{ color: "#52c41a" }}
									/>
								</FlexbleCard>
							</Col>
							<Col lg={6} sm={12} xs={24}>
								<FlexbleCard>
									<Statistic
										prefix={<UsergroupAddOutlined />}
										title="New This Month"
										value={stats?.newUsersThisMonth}
										valueStyle={{ color: "#faad14" }}
									/>
								</FlexbleCard>
							</Col>
							<Col lg={6} sm={12} xs={24}>
								<FlexbleCard>
									<Statistic
										prefix={<UsergroupDeleteOutlined />}
										title="In-Active Users"
										value={stats?.inactiveUsers}
										valueStyle={{ color: "#722ed1" }}
									/>
								</FlexbleCard>
							</Col>
						</Row>

						{/* Charts Section */}
						<Row gutter={[16, 16]}>
							<Col xs={24}>
								<FlexbleCard style={{ height: 300 }} title="User Growth">
									<div
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											height: 200,
										}}
									>
										<Column {...config} />
									</div>
								</FlexbleCard>
							</Col>
						</Row>
					</>
				);
			})()}
		</div>
	);
}

export default Dashboard;
