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
import { useCallback, useEffect, useState } from "react";
import styles from "./login.module.css";

const { Title, Text } = Typography;

const ERROR_MESSAGES = {
	INVALID_EMAIL: "Please enter a correct email id like eg: john.doe@gmail.com",
	INVALID_CREDENTIALS: "Invalid credentials. Please try again.",
	GENERIC_ERROR: "An error occurred. Please try again.",
	UNKNOWN_ERROR: "An unknown error occurred",
	LOGIN_FAILED: "Login Failed",
	CREDENTIALS_SIGNIN: "CredentialsSignin",
	TRY_AGAIN: "Please try again, to signin",
};

const REDIRECT_URL = "/part_two/dashboard";

export default function LoginPage() {
	const [error, setError] = useState<string>("");
	const searchParams = useSearchParams();

	const showErrorNotification = useCallback(
		(message: string, description: string) => {
			notification.error({
				message,
				description,
			});
		},
		[]
	);

	const onFinish = useCallback(
		async (values: { email: string; password: string }) => {
			try {
				if (!isValidEmail(values.email)) {
					throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
				}
				const result = await signIn("credentials", {
					email: values.email,
					password: values.password,
					redirect: true,
					callbackUrl: REDIRECT_URL,
				});

				if (result?.error) {
					throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
				setError(errorMessage);
				showErrorNotification(ERROR_MESSAGES.LOGIN_FAILED, errorMessage);
			}
		},
		[showErrorNotification]
	);

	const {
		values,
		setFieldError,
		isSubmitting,
		handleSubmit,
		setFieldValue,
		registerForm,
	} = useFormHandler({
		initialValues: { email: "", password: "" },
		onSubmit: onFinish,
		onError: useCallback(
			(_error: unknown) => {
				const errorMessage =
					_error instanceof Error
						? _error.message
						: ERROR_MESSAGES.UNKNOWN_ERROR;
				showErrorNotification(ERROR_MESSAGES.LOGIN_FAILED, errorMessage);
			},
			[showErrorNotification]
		),
	});

	const [form] = Form.useForm();

	useEffect(() => {
		registerForm(form);
	}, [form, registerForm]);

	useEffect(() => {
		const credentialSigninError = searchParams?.get("error");
		if (credentialSigninError === ERROR_MESSAGES.CREDENTIALS_SIGNIN) {
			showErrorNotification(
				ERROR_MESSAGES.CREDENTIALS_SIGNIN,
				ERROR_MESSAGES.TRY_AGAIN
			);
		}
	}, [searchParams, showErrorNotification]);

	const handlePasswordChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target;
			const { isValid, errors } = validatePassword(value, {
				minLength: 6,
				requireUppercase: false,
				requireLowercase: false,
				requireNumbers: true,
				requireSpecialChars: false,
			});

			setFieldError(
				"password",
				!isValid && errors.length > 0 ? errors.join(", ") : null
			);
			setFieldValue("password", value);
		},
		[setFieldError, setFieldValue]
	);

	return (
		<div className={styles.container}>
			<Card className={styles.card} title="Standard Card">
				<div className={styles.titleContainer}>
					<Title className={styles.title} level={2}>
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
							placeholder: "Enter your email",
						}}
						label="Enter your email"
						name="email"
						type="email"
					/>

					<CustomFormInput<PasswordProps>
						inputProps={{
							value: values.password,
							prefix: <LockOutlined />,
							onChange: handlePasswordChange,
							placeholder: "Enter your password",
						}}
						name="password"
						type="password"
					/>
					<SubmitButton
						className={styles.submitButton}
						isSubmittingFailed={error.length > 0}
						loading={isSubmitting}
					>
						Sign In
					</SubmitButton>
				</Form>

				<div className={styles.demoCredentials}>
					<Text className={styles.demoCredentialsText} type="secondary">
						Demo Credentials:
						<br />
						Admin: superadmin@gmail.com / superadmin@12345
					</Text>
				</div>
			</Card>
		</div>
	);
}
