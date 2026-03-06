import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Terms of Service",
    description:
        "Terms of Service for SheetOS AI — AI-powered Excel and Word automation add-in.",
};

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-20">
                <article className="prose prose-neutral dark:prose-invert max-w-[720px] mx-auto px-6">
                    <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
                    <p className="text-fg-faint text-[14px]">Last updated: March 2026</p>

                    <h2>1. Acceptance</h2>
                    <p>By using the SheetOS AI add-in for Microsoft Excel or Word, you agree to these Terms. If you do not agree, you must stop using the software.</p>

                    <h2>2. License</h2>
                    <p>We grant you a non-transferable, non-exclusive, revocable license to use SheetOS AI subject to these conditions:</p>
                    <ul>
                        <li>You may not reverse-engineer or disassemble our AST validator or orchestration engine.</li>
                        <li>You may not use SheetOS AI for spam, scraping, or illegal automated activities.</li>
                    </ul>

                    <h2>3. AI Disclaimer</h2>
                    <p>SheetOS uses generative AI (LLMs) to produce automation code. AI can make mistakes. <strong>You are responsible for reviewing the code preview before executing changes.</strong> We provide instant rollbacks, but accept no liability for unintended outcomes from auto-generated code.</p>

                    <h2>4. Your Data</h2>
                    <p>You retain ownership of all spreadsheet data and prompts. By using SheetOS, you grant us the limited right to transmit your prompt to AI vendor APIs to service your automation request.</p>

                    <h2>5. Limitation of Liability</h2>
                    <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, SHEETOS AI SHALL NOT BE LIABLE FOR CONSEQUENTIAL, INCIDENTAL, OR PUNITIVE DAMAGES EXCEEDING FEES PAID. The software is provided &quot;AS-IS&quot;.</p>

                    <h2>6. Governing Law</h2>
                    <p>These terms are governed by the laws of India.</p>
                </article>
            </main>
            <Footer />
        </>
    );
}
