"use client";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Spin, Typography } from "antd";
import { useSession } from "next-auth/react";
import type React from "react";
import { useState } from "react";
import UserForm from "@/components/user-form";
import UserTable from "@/components/user-table";
import type { User } from "@/lib/types";

const { Title } = Typography;

const UserList: React.FC = () => {
	const { status } = useSession();

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

	const handleCreateUser = () => {
		setEditingUser(undefined);
		setIsModalVisible(true);
	};

	const handleEditUser = (user: User) => {
		setEditingUser(user);
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setEditingUser(undefined);
	};

	const handleSuccess = () => {
		setIsModalVisible(false);
		setEditingUser(undefined);
	};
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
	return (
		<div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
			<Space
				style={{
					marginBottom: 16,
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<Title level={2} style={{ margin: 0 }}>
					User Management
				</Title>
				<Button
					icon={<PlusOutlined />}
					onClick={handleCreateUser}
					type="primary"
				>
					Add User
				</Button>
			</Space>

			<UserTable onEdit={handleEditUser} />

			{isModalVisible && (
				<Modal
					footer={null}
					onCancel={handleCancel}
					open={isModalVisible}
					title={editingUser ? "Edit User" : "Create New User"}
				>
					<UserForm
						onCancel={handleCancel}
						onSuccess={handleSuccess}
						user={editingUser}
					/>
				</Modal>
			)}
		</div>
	);
};

export default UserList;
