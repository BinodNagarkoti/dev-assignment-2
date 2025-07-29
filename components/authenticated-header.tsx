"use client";
import { LogoutOutlined } from "@ant-design/icons";
import { Button, Spin, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const { Title } = Typography;

export default function AuthenticatedHeader() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const pathName = usePathname();

	const handleLogout = async () => {
		await signOut({ redirect: false });
		router.push("/part_two/auth/login");
	};

	if (!session) {
		// router.push('/part_two/auth/login');
		return null;
	}
	const isNavItemActive = (itemName: string) => pathName.includes(itemName);
	const showAdminBar =
		session?.user &&
		(pathName.includes("dashboard") || pathName.includes("user"));
	if (
		(status as "atuhenticated" | "loading" | "unauthenticated") === "loading" ||
		session === null
	) {
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
	if (showAdminBar) {
		return (
			<>
				{/* Header */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						padding: 24,
					}}
				>
					<div>
						<Title level={2} style={{ margin: 0 }}>
							Welcome back, {session.user?.name}!
						</Title>
						<p style={{ color: "#666", margin: 0 }}>
							Here's what's happening with your users today.
						</p>
					</div>
					<div style={{ display: "flex", gap: 16 }}>
						<Button
							color={
								isNavItemActive("/part_two/dashboard") ? "primary" : "default"
							}
							onClick={() => router.push("/part_two/dashboard")}
							type="default"
							variant={
								isNavItemActive("/part_two/dashboard") ? "text" : "outlined"
							}
						>
							Dashboard
						</Button>
						<Button
							color={isNavItemActive("/part_two/users") ? "primary" : "default"}
							onClick={() => router.push("/part_two/users")}
							type="default"
							variant={isNavItemActive("/part_two/users") ? "text" : "outlined"}
						>
							Manage Users
						</Button>
						<Button
							danger
							icon={<LogoutOutlined />}
							onClick={handleLogout}
							type="primary"
						>
							Logout
						</Button>
					</div>
				</div>
			</>
		);
	}
	return null;
}
