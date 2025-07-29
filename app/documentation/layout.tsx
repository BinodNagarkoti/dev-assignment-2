import { delay } from "@/lib/utils/mock-data";
import DocumentationLayoutClient from "../../components/documentation-layout-client";
import { docPages } from "./doc-config";

interface DocLink {
	slug: string;
	title: string;
}

async function getDocLinks(): Promise<DocLink[]> {
	await delay(100);
	// Use the predefined order from doc-config.ts
	return docPages;
}

export default async function DocumentationLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const docLinks = await getDocLinks();

	return (
		<DocumentationLayoutClient docLinks={docLinks}>
			{children}
		</DocumentationLayoutClient>
	);
}
