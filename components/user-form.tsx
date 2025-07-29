"use client";
import {
	MailOutlined,
	PhoneOutlined,
	ReadOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	Button,
	type DatePickerProps,
	Flex,
	Form,
	type InputProps,
	notification,
	type SelectProps,
	Space,
} from "antd";
import dayjs from "dayjs";
import {
	CustomFormInput,
	isValidEmail,
	isValidPhone,
	SubmitButton,
	useFormHandler,
} from "org-st-demo-ui";
import type React from "react";
import { useEffect, useState } from "react";
import { useCreateUser, useUpdateUser } from "@/lib/hooks/use-users";
import type { CreateUserData, UpdateUserData, User } from "@/lib/types";

interface UserFormProps {
	user?: User;
	onSuccess: () => void;
	onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSuccess, onCancel }) => {
	const [form] = Form.useForm();
	const createUserMutation = useCreateUser();
	const updateUserMutation = useUpdateUser();
	const [error, setError] = useState<string>("");

	useEffect(() => {
		if (user) {
			form.setFieldsValue({
				...user,
				dob: dayjs(user.dob),
			});
		} else {
			form.resetFields();
		}
		return () => {
			form.resetFields();
		};
	}, [user, form]);

	const onFinish = async (values: User) => {
		try {
			if (!isValidPhone(values.phone)) {
				throw new Error(
					"invalid phone input Neplease exactly 10 digits length without country code `+977`"
				);
			}
			if (!isValidEmail(values.email)) {
				throw new Error(
					"invalid email input, please enter valid email like eg: john.doe@gmail.com"
				);
			}

			if (user) {
				// Update user
				const updateData: UpdateUserData = {
					...values,
				};
				await updateUserMutation.mutateAsync(updateData);
				notification.success({ message: "User updated successfully!" });
			} else {
				// Create user
				const createData: CreateUserData = {
					...values,
				};
				await createUserMutation.mutateAsync(createData);
				notification.success({ message: "User created successfully!" });
			}
			onSuccess();
			setError("");
			form.resetFields();
		} catch (error: unknown) {
			setError(
				error instanceof Error ? error.message : "An unknown error occurred"
			);
			notification.error({
				message: "Operation failed",
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
		}
	};
	const { values, isSubmitting, handleSubmit, setFieldValue, registerForm } =
		useFormHandler<User>({
			initialValues: user
				? { ...user }
				: {
						email: "",
						address: "",
						department: "",
						dob: new Date("1994/09/01"),
						fullName: "",
						phone: "",
						position: "",
						status: "active",
					},
			onSubmit: onFinish,
			onError: (error: unknown) => {
				notification.error({
					message: "Operation failed",
					description:
						error instanceof Error
							? error.message
							: "An unknown error occurred",
				});
			},
		});

	useEffect(() => {
		registerForm(form);
	}, [form, registerForm]);

	return (
		<Form form={form} layout="vertical" onFinish={handleSubmit}>
			<CustomFormInput
				inputProps={{
					prefix: <UserOutlined />,
					placeholder: "Enter user full name",
					value: values.fullName,
					onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
						setFieldValue("fullName", e.target.value),
				}}
				label="Full Name"
				name="fullName"
				type="text"
			/>
			<Flex gap={5}>
				<CustomFormInput<InputProps>
					inputProps={{
						prefix: <MailOutlined />,
						placeholder: "Enter user email",
						value: values.email,
						onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
							setFieldValue("email", e.target.value),
					}}
					label="User Email"
					name="email"
					type="email"
				/>
				<CustomFormInput<InputProps>
					inputProps={{
						prefix: <PhoneOutlined />,
						placeholder: "Enter user phone number",
						value: values.phone,
						onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
							setFieldValue("phone", e.target.value),
					}}
					label="Phone Number"
					name="phone"
					type="tel"
				/>
			</Flex>
			<CustomFormInput<InputProps>
				inputProps={{
					prefix: <ReadOutlined />,
					placeholder: "Enter user full address",
					value: values.address,
					onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
						setFieldValue("address", e.target.value),
				}}
				label="Full Address"
				name="address"
				type="text"
			/>
			<Flex gap={5}>
				<div style={{ flex: 1 }}>
					<CustomFormInput<DatePickerProps>
						inputProps={{
							prefix: <ReadOutlined />,
							placeholder: "Select user date of birth",
							value: values.dob ? dayjs(new Date(values.dob)) : null,
							style: { width: "100%" },
							onChange: (date: dayjs.Dayjs, _dateString: string | string[]) =>
								setFieldValue("dob", date),
						}}
						label="Date of Birth"
						name="dob"
						type="date"
					/>
				</div>
				<div style={{ flex: 1 }}>
					<CustomFormInput<SelectProps>
						inputProps={{
							placeholder: "Select user status (active/in-active)",
							value: values.status,
							style: { width: "100%" },
							onChange: (value: string) => setFieldValue("status", value),
							options: [
								{ label: "Active", value: "active" },
								{ label: "Inactive", value: "inactive" },
							],
						}}
						label="User Status"
						name="status"
						type="select"
					/>
				</div>
			</Flex>
			<Flex gap={5}>
				<CustomFormInput<InputProps>
					inputProps={{
						placeholder: "Enter user department",
						value: values.department,
						onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
							setFieldValue("department", e.target.value),
					}}
					label="Department"
					name="department"
					type="text"
				/>
				<CustomFormInput<InputProps>
					inputProps={{
						placeholder: "Enter user position",
						value: values.position,
						onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
							setFieldValue("position", e.target.value),
					}}
					label="Position"
					name="position"
					type="text"
				/>
			</Flex>
			<Space>
				<SubmitButton
					isSubmittingFailed={error.length > 0}
					loading={
						createUserMutation.isPending ||
						updateUserMutation.isPending ||
						isSubmitting
					}
				>
					{user ? "Update User" : "Create User"}
				</SubmitButton>
				<Form.Item label={null}>
					<Button onClick={onCancel}>Cancel</Button>
				</Form.Item>
			</Space>
		</Form>
	);
};

export default UserForm;
