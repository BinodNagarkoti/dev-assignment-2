"use client";
import { Button } from "antd";
import { FlexbleCard } from "org-st-demo-ui";

export default function Home() {
	return (
		<FlexbleCard
			style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
			title={"Ant React UI Kit Demo"}
		>
			<div style={{ marginBottom: 20 }}>
				<Button
					href="/part_two/auth/login"
					style={{ marginRight: 16 }}
					type="link"
				>
					Login Form
				</Button>
				<Button href="/documentation" style={{ marginRight: 16 }} type="link">
					Documentation
				</Button>
			</div>
		</FlexbleCard>
	);
}
