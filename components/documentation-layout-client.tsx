"use client";

import { Layout, Menu, Typography } from "antd";
import Link from "next/link";
import type React from "react";

const { Sider, Content } = Layout;
const { Title } = Typography;

interface DocLink {
	slug: string;
	title: string;
}

interface DocumentationLayoutClientProps {
	docLinks: DocLink[];
	children: React.ReactNode;
}

export default function DocumentationLayoutClient({
	docLinks,
	children,
}: DocumentationLayoutClientProps) {
	const menuItems = docLinks.map((link) => ({
		key: link.slug,
		label: <Link href={`/documentation/${link.slug}`}>{link.title}</Link>,
	}));

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Sider
				style={{
					overflow: "auto", // Enable scrolling for sidebar content
					height: "100vh", // Make sidebar take full viewport height
					position: "fixed", // Make sidebar sticky
					left: 0,
					top: 0,
					bottom: 0,
					background: "#fff",
					padding: "32px 0", // Increased padding
					borderRight: "1px solid #f0f0f0", // Subtle border
					boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)", // Soft shadow
				}} // Slightly wider sidebar
				width={280}
			>
				<div style={{ padding: "0 28px", marginBottom: "32px" }}>
					<Title level={2} style={{ margin: 0, color: "#333" }}>
						Documentation
					</Title>
				</div>
				<Menu
					defaultSelectedKeys={["introduction"]}
					items={menuItems}
					mode="inline" // Adjust height for title padding
					style={{ height: "calc(100% - 88px)", borderRight: 0 }}
					// Ant Design's default styles are usually good, but we can customize if needed
					// For now, relying on default Ant Design animations for smoothness
				/>
			</Sider>
			<Content
				style={{
					padding: "40px", // Increased padding for content
					margin: "0px auto 0px 280px",
					minHeight: "100vh", // Ensure content area takes full height
					background: "#f0f2f5", // Light background for content area
					overflowY: "auto", // Ensure scrollability
					boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // More pronounced shadow
					borderRadius: "8px",
				}}
			>
				{children}
			</Content>
		</Layout>
	);
}
