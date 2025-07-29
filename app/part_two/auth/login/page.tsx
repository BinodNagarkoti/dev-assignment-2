"use client";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Form, type InputProps, notification, Typography } from "antd";
import type { PasswordProps } from "antd/es/input";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import {
	FlexbleCard as Card,
	CustomFormInput,
	isValidEmail,
	SubmitButton,
	useFormHandler,
	validatePassword,
} from "org-st-demo-ui";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const TRYAGAINTEXT = "Please try again, to signin";
export default function LoginPage() {
	const [error, setError] = useState<string>("");
	const searchParams = useSearchParams();
	const onFinish = async (values: { email: string; password: string }) => {
		try {
			if (!isValidEmail(values.email)) {
				throw new Error(
					"Please enter an correct email id like eg: john.doe@gmail.com"
				);
			}
			const result = await signIn("credentials", {
				email: values.email,
				password: values.password,
				redirect: true,
				callbackUrl: "/part_two/dashboard",
			});

			if (result?.error) {
				throw new Error("Invalid credentials. Please try again.");
			}
			// else {
			//     // Get session to verify login
			//     const session = await getSession();
			//     if (session) {
			//         router.push('/part_two/dashboard');
			//     }
			// }
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred. Please try again."
			);
			notification.error({
				message: "Login Failed",
				description:
					err instanceof Error
						? err.message
						: "An error occurred. Please try again.",
			});
		}
	};
	const {
		values,
		errors: _errors,
		setFieldError,
		isSubmitting,
		handleSubmit,
		setFieldValue,
		registerForm,
	} = useFormHandler({
		initialValues: { email: "", password: "" },
		onSubmit: onFinish,
		onError: (_error: unknown) => {
			notification.error({
				message: "Login Failed",
				description:
					_error instanceof Error
						? _error.message
						: "An unknown error occurred",
			});
			// console.error("Login failed:", error);
		},
	});

	const [form] = Form.useForm();

	useEffect(() => {
		registerForm(form);
	}, [form, registerForm]);
	useEffect(() => {
		const credentialSigninError = searchParams?.get("error");
		if (credentialSigninError && credentialSigninError.length > 0) {
			notification.error({
				message: "CredentialsSignin",
				description:
					credentialSigninError === "CredentialsSignin"
						? TRYAGAINTEXT
						: "An unknown error occurred",
			});
		}
	}, [searchParams]);

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			}}
		>
			<Card
				style={{
					width: 400,
					boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
					borderRadius: "12px",
				}}
				title="Standard Card"
			>
				<div style={{ textAlign: "center", marginBottom: 24 }}>
					<Title level={2} style={{ color: "#1890ff", marginBottom: 8 }}>
						Welcome Back
					</Title>
					<Text type="secondary">Sign in to your account to continue</Text>
				</div>
				<Form
					form={form}
					layout="vertical"
					name="login"
					onFinish={handleSubmit}
					requiredMark={false}
				>
					<CustomFormInput<InputProps>
						inputProps={{
							value: values.email,
							prefix: <MailOutlined />,
							onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
								setFieldValue("email", e.target.value),
						}}
						label="Enter your email"
						name="email"
						type="email"
					/>

					<CustomFormInput<PasswordProps>
						inputProps={{
							value: values.password,
							prefix: <LockOutlined />,
							onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
								const {
									isValid,
									score: _score,
									errors,
								} = validatePassword(e.target.value, {
									minLength: 6,
									requireUppercase: false,
									requireLowercase: false,
									requireNumbers: true,
									requireSpecialChars: false,
								});
								if (!isValid && errors.length > 0) {
									setFieldError("password", errors.join(", "));
								} else {
									setFieldError("password", null);
								}
								setFieldValue("password", e.target.value);
							},
						}}
						name="password"
						type="password"
					/>
					<SubmitButton
						isSubmittingFailed={error.length > 0}
						loading={isSubmitting}
						style={{ height: 48, fontSize: 16 }}
					>
						Sign In
					</SubmitButton>
				</Form>

				<div style={{ marginTop: 24, textAlign: "center" }}>
					<Text style={{ fontSize: 12 }} type="secondary">
						Demo Credentials:
						<br />
						Admin: superadmin@gmail.com / superadmin@12345
					</Text>
				</div>
			</Card>
		</div>
	);
}
