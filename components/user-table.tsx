"use client";
import {
	DeleteOutlined,
	EditOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import { Button, Input, notification, Popconfirm, Space, Table } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDeleteUser, useDeleteUsers, useUsers } from "@/lib/hooks/use-users";
import type { User, UserFilters } from "@/lib/types";

interface UserTableProps {
	onEdit: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ onEdit }) => {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [filters, setFilters] = useState<UserFilters>({});
	const [searchText, setSearchText] = useState("");
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

	const { data, isLoading, error } = useUsers(page, pageSize, filters);
	const deleteUserMutation = useDeleteUser();
	const deleteUsersMutation = useDeleteUsers(); // Add bulk delete mutation

	useEffect(() => {
		if (error) {
			notification.error({
				message: "Error fetching users",
				description: error.message,
			});
		}
	}, [error]);

	const handleTableChange: TableProps<User>["onChange"] = (
		pagination,
		tableFilters,
		sorter
	) => {
		setPage(pagination.current || 1);
		setPageSize(pagination.pageSize || 10);

		const newFilters: UserFilters = { ...filters };

		// Handle status filter from table's built-in filters
		if (tableFilters.status && tableFilters.status.length > 0) {
			const statusValue = tableFilters.status[0] as "active" | "inactive";
			newFilters.status = statusValue;
		} else {
			newFilters.status = undefined; // No status filter selected
		}

		// Handle sorting
		if (sorter && !Array.isArray(sorter)) {
			// Single column sorting
			const { columnKey, order } = sorter;
			if (columnKey && order) {
				newFilters.sortBy = columnKey.toString(); // Convert React.Key to string
				newFilters.sortOrder = order === "ascend" ? "asc" : "desc"; // Map Ant Design order to 'asc'/'desc'
			} else {
				newFilters.sortBy = undefined;
				newFilters.sortOrder = undefined;
			}
		} else if (Array.isArray(sorter) && sorter.length > 0) {
			// Multiple column sorting (if supported/needed)
			// For simplicity, take the first one if multiple are sorted
			const { columnKey, order } = sorter[0];
			if (columnKey && order) {
				newFilters.sortBy = columnKey.toString();
				newFilters.sortOrder = order === "ascend" ? "asc" : "desc";
			} else {
				newFilters.sortBy = undefined;
				newFilters.sortOrder = undefined;
			}
		} else {
			newFilters.sortBy = undefined;
			newFilters.sortOrder = undefined;
		}

		setFilters(newFilters);
		setPage(1); // Reset to first page on filter/sort change
	};

	const triggerSearch = useCallback((value: string) => {
		setFilters((prev) => ({ ...prev, search: value }));
		setPage(1); // Reset to first page on search
	}, []);

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchText(value);

		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(() => {
			triggerSearch(value);
		}, 500); // Debounce for 500ms
	};

	const handleSearchButtonClick = (value: string) => {
		// Clear any pending debounce for immediate search
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
		triggerSearch(value);
	};

	const handleDelete = useCallback(
		async (ids: string | string[]) => {
			try {
				if (Array.isArray(ids)) {
					await deleteUsersMutation.mutateAsync(ids);
					notification.success({
						message: `${ids.length} users deleted successfully!`,
					});
				} else {
					await deleteUserMutation.mutateAsync(ids);
					notification.success({ message: "User deleted successfully!" });
				}
				setSelectedRowKeys([]); // Clear selection after delete
			} catch (err: unknown) {
				notification.error({
					message: "Failed to delete user(s)",
					description:
						err instanceof Error
							? err.message
							: "Something went wrong contact to adminstrator",
				});
			}
		},
		[deleteUsersMutation.mutateAsync, deleteUserMutation.mutateAsync]
	);

	const columns: TableProps<User>["columns"] = React.useMemo(
		() => [
			{
				title: "Name",
				dataIndex: "fullName",
				key: "fullName",
			},
			{
				title: "Email",
				dataIndex: "email",
				key: "email",
			},
			{
				title: "Address",
				dataIndex: "address",
				key: "address",
			},
			{
				title: "Department",
				dataIndex: "department",
				key: "department",
			},
			{
				title: "Position",
				dataIndex: "position",
				key: "position",
			},
			{
				title: "Status",
				dataIndex: "status",
				key: "status",
				filters: [
					{ text: "Active", value: "active" },
					{ text: "Inactive", value: "inactive" },
				],
				render: (status: "active" | "inactive") => (
					<span style={{ textTransform: "capitalize" }}>{status}</span>
				),
			},
			{
				title: "Actions",
				key: "actions",
				render: (_, record) => (
					<Space size="middle">
						<Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
							Edit
						</Button>
						<Popconfirm
							cancelText="No"
							okText="Yes"
							onConfirm={() => handleDelete(record.id)}
							title="Are you sure to delete this user?"
						>
							<Button
								danger
								icon={<DeleteOutlined />}
								loading={deleteUserMutation.isPending}
							>
								Delete
							</Button>
						</Popconfirm>
					</Space>
				),
			},
		],
		[onEdit, handleDelete, deleteUserMutation.isPending]
	);

	const rowSelection = React.useMemo(
		() => ({
			selectedRowKeys,
			onChange: (selectedKeys: React.Key[]) => {
				setSelectedRowKeys(selectedKeys);
			},
		}),
		[selectedRowKeys]
	);

	return (
		<div>
			<Space
				style={{
					marginBottom: 16,
					width: "100%",
					justifyContent: "space-between",
				}}
			>
				<Input.Search
					allowClear
					enterButton={<SearchOutlined />}
					onChange={handleSearchInputChange}
					onSearch={handleSearchButtonClick}
					placeholder="Search by name, email, department, position"
					style={{ width: 400 }}
					value={searchText}
				/>
			</Space>
			<Table
				columns={columns}
				dataSource={data?.users}
				loading={isLoading}
				onChange={handleTableChange}
				pagination={{
					current: data?.pagination.page,
					pageSize: data?.pagination.pageSize,
					total: data?.pagination.total,
					showSizeChanger: true,
					pageSizeOptions: ["5", "10", "20", "50"],
				}}
				rowKey="id"
				rowSelection={rowSelection}
			/>
			{selectedRowKeys.length > 0 && (
				<Popconfirm
					cancelText="No"
					okText="Yes"
					onConfirm={() => handleDelete(selectedRowKeys as string[])}
					title={`Are you sure to delete ${selectedRowKeys.length} selected users?`}
				>
					<Button
						danger
						loading={deleteUsersMutation.isPending}
						style={{ marginTop: 16 }}
					>
						Delete Selected ({selectedRowKeys.length})
					</Button>
				</Popconfirm>
			)}
		</div>
	);
};

export default UserTable;
