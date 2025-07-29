import { promises as fs } from "node:fs";
import path from "node:path";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import type React from "react";

const LANGUAGE_REGEX = /language-(\w+)/;

// Define custom components for MDX rendering
const components: MDXComponents = {
	h1: (props) => (
		<h1
			id={
				Array.isArray(props.children)
					? props.children
							.join("")
							.toLowerCase()
							.replace(/\s+/g, "-")
							.replace(/[^\w-]+/g, "")
					: ""
			}
			style={{
				fontSize: "2.8em",
				marginBottom: "0.6em",
				marginTop: "1.8em",
				borderBottom: "1px solid #eee",
				paddingBottom: "0.4em",
				fontFamily: "Arial, sans-serif",
			}}
			{...props}
		>
			{props.children}
		</h1>
	),
	h2: (props) => (
		<h2
			id={
				Array.isArray(props.children)
					? props.children
							.join("")
							.toLowerCase()
							.replace(/\s+/g, "-")
							.replace(/[^\w-]+/g, "")
					: ""
			}
			style={{
				fontSize: "2.2em",
				marginBottom: "0.5em",
				marginTop: "1.5em",
				borderBottom: "1px solid #eee",
				paddingBottom: "0.3em",
				fontFamily: "Arial, sans-serif",
			}}
			{...props}
		>
			{props.children}
		</h2>
	),
	h3: (props) => (
		<h3
			id={
				Array.isArray(props.children)
					? props.children
							.join("")
							.toLowerCase()
							.replace(/\s+/g, "-")
							.replace(/[^\w-]+/g, "")
					: ""
			}
			style={{
				fontSize: "1.9em",
				marginBottom: "0.4em",
				marginTop: "1.2em",
				fontFamily: "Arial, sans-serif",
			}}
			{...props}
		>
			{props.children}
		</h3>
	),
	h4: (props) => (
		<h4
			id={
				Array.isArray(props.children)
					? props.children
							.join("")
							.toLowerCase()
							.replace(/\s+/g, "-")
							.replace(/[^\w-]+/g, "")
					: ""
			}
			style={{
				fontSize: "1.6em",
				marginBottom: "0.3em",
				marginTop: "1em",
				fontFamily: "Arial, sans-serif",
			}}
			{...props}
		>
			{props.children}
		</h4>
	),
	h5: (props) => (
		<h5
			id={
				Array.isArray(props.children)
					? props.children
							.join("")
							.toLowerCase()
							.replace(/\s+/g, "-")
							.replace(/[^\w-]+/g, "")
					: ""
			}
			style={{
				fontSize: "1.3em",
				marginBottom: "0.2em",
				marginTop: "0.8em",
				fontFamily: "Arial, sans-serif",
			}}
			{...props}
		>
			{props.children}
		</h5>
	),
	h6: (props) => (
		<h6
			id={
				Array.isArray(props.children)
					? props.children
							.join("")
							.toLowerCase()
							.replace(/\s+/g, "-")
							.replace(/[^\w-]+/g, "")
					: ""
			}
			style={{
				fontSize: "1.1em",
				marginBottom: "0.1em",
				marginTop: "0.6em",
				fontFamily: "Arial, sans-serif",
			}}
			{...props}
		>
			{props.children}
		</h6>
	),
	p: (props) => (
		<p
			style={{
				marginBottom: "1.2em",
				lineHeight: "1.8",
				fontSize: "1.1em",
				fontFamily: "Georgia, serif",
			}}
			{...props}
		>
			{props.children}
		</p>
	),
	ul: (props) => (
		<ul
			style={{
				listStyleType: "disc",
				marginLeft: "25px",
				marginBottom: "1.2em",
				lineHeight: "1.8",
			}}
			{...props}
		>
			{props.children}
		</ul>
	),
	ol: (props) => (
		<ol
			style={{
				listStyleType: "decimal",
				marginLeft: "25px",
				marginBottom: "1.2em",
				lineHeight: "1.8",
			}}
			{...props}
		>
			{props.children}
		</ol>
	),
	li: (props) => (
		<li style={{ marginBottom: "0.6em" }} {...props}>
			{props.children}
		</li>
	),
	blockquote: (props) => (
		<blockquote
			style={{
				borderLeft: "5px solid #ddd",
				paddingLeft: "1.5em",
				margin: "1.5em 0",
				color: "#555",
				fontStyle: "italic",
				backgroundColor: "#f9f9f9",
				padding: "1em",
				borderRadius: "4px",
			}}
			{...props}
		>
			{props.children}
		</blockquote>
	),
	a: (props) => (
		<a
			href={props.href}
			style={{
				color: "#1890ff",
				textDecoration: "underline",
				fontWeight: "bold",
			}}
			{...props}
		>
			{props.children}
		</a>
	),
	code: ({
		node,
		inline,
		className,
		children,
		...props
	}: React.ComponentPropsWithoutRef<"code"> & {
		node?: object;
		inline?: boolean;
		className?: string;
	}) => {
		const match = LANGUAGE_REGEX.exec(className || "");
		return !inline && match ? (
			<pre
				style={{
					backgroundColor: "#2d2d2d",
					color: "#f8f8f2",
					padding: "18px",
					borderRadius: "6px",
					overflowX: "auto",
					marginBottom: "1.5em",
					lineHeight: "1.5",
					fontSize: "0.95em",
				}}
			>
				<code className={`language-${match[1]}`} {...props}>
					{children}
				</code>
			</pre>
		) : (
			<code
				className={className}
				style={{
					backgroundColor: "#f0f0f0",
					padding: "3px 6px",
					borderRadius: "4px",
					fontSize: "0.9em",
					fontFamily: "monospace",
				}}
				{...props}
			>
				{children}
			</code>
		);
	},
};

async function getDocumentationContent(slug: string) {
	const filePath = path.join(
		process.cwd(),
		"app/documentation/_content",
		`${slug}.mdx`
	);
	try {
		const fileContent = await fs.readFile(filePath, "utf-8");
		return fileContent;
	} catch (_error: unknown) {
		// console.error(`Failed to read documentation for slug ${slug}:`, _error);
		return `## Documentation Not Found\n\nCould not load the documentation content for "${slug}".`;
	}
}

export default async function DocumentationPage({
	params,
}: {
	params: { slug: string };
}) {
	const { slug } = params;
	const markdownContent = await getDocumentationContent(slug);

	return (
		<div
			style={{
				maxWidth: "800px",
				margin: "0 auto",
				background: "#fff",
				padding: "40px",
				borderRadius: "10px",
				boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
			}}
		>
			<MDXRemote components={components} source={markdownContent} />
		</div>
	);
}
