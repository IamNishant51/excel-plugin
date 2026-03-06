import type { Metadata } from "next";
import DocsLayout from '@/components/docs/DocsLayout';

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Complete guide to installing and using SheetOS AI for Excel and Word automation. Installation steps, features, and security details.",
};

export default function DocsPage() {
  return <DocsLayout />;
}
