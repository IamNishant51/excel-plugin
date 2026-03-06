import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-20">
                <article className="prose prose-neutral dark:prose-invert max-w-[720px] mx-auto px-6">
                    <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
                    <p className="text-fg-faint text-[14px]">Last updated: March 2026</p>

                    <h2>1. Overview</h2>
                    <p>At SheetOS AI, we take your privacy seriously. Our tool processes natural language instructions and validates abstract syntax trees (AST) to automate your Excel and Word workflows safely. We only collect data necessary to provide and improve this service.</p>

                    <h2>2. Information We Collect</h2>
                    <ul>
                        <li><strong>Account Information:</strong> If you join our waitlist, we collect your email address.</li>
                        <li><strong>Telemetry:</strong> We log basic metrics (error rates, success rates) to improve our models.</li>
                        <li><strong>Prompts:</strong> Text queries you type into SheetOS AI.</li>
                    </ul>

                    <h2>3. How We Process Data</h2>
                    <p>When you execute a command, your prompt and necessary schema context (column headers, cell bounds — NOT your entire dataset) are sent to LLM providers (OpenAI, Google, Anthropic). <strong>We do not use your data to train public AI models.</strong></p>

                    <h2>4. Security</h2>
                    <p>All API keys are encrypted at rest using AES-GCM with device-specific salts. Our AST validation pipeline blocks arbitrary or harmful patterns including network calls and file system access.</p>

                    <h2>5. Third-Party Services</h2>
                    <p>We use enterprise-grade AI providers that comply with SOC2 and other data protection frameworks. Your prompts are routed to your selected provider based on your Add-in settings.</p>

                    <h2>6. Contact</h2>
                    <p>Questions or data deletion requests: <a href="mailto:privacy@sheetos.ai">privacy@sheetos.ai</a></p>
                </article>
            </main>
            <Footer />
        </>
    );
}
