import { getConfig, GROQ_MODELS, GEMINI_MODELS, LLMConfig } from "../../services/llm.service";

declare global {
    interface Window {
        __OLLAMA_MODELS__?: any[];
    }
}

export class SettingsPanel {
    render(tempProvider?: string): string {
        const config = getConfig();
        const activeProvider = tempProvider || config.provider;

        return `
            <div class="panel-content settings-panel">
                <div class="panel-header">
                    <h2>Engine Configuration</h2>
                    <button id="close-settings" class="close-btn">✕</button>
                </div>

                <div class="card">
                    <label for="ai-provider">AI Provider Flagship</label>
                    <select id="ai-provider" class="form-control">
                        <option value="groq" ${activeProvider === 'groq' ? 'selected' : ''}>Groq (Ultra-Fast)</option>
                        <option value="gemini" ${activeProvider === 'gemini' ? 'selected' : ''}>Google Gemini (Free/Smart)</option>
                        <option value="openai" ${activeProvider === 'openai' ? 'selected' : ''}>OpenAI (Standard)</option>
                        <option value="local" ${activeProvider === 'local' ? 'selected' : ''}>Ollama (Local)</option>
                    </select>
                </div>

                <div id="provider-details">
                    ${this.renderProviderFields(activeProvider, config)}
                </div>

                <div class="action-footer">
                    <button id="save-settings" class="btn btn-primary">Save Configuration</button>
                </div>
            </div>
        `;
    }

    private renderProviderFields(provider: string, config: LLMConfig): string {
        if (provider === 'groq') {
            return `
                <div class="card">
                    <label for="groq-key">Groq API Key</label>
                    <div class="input-eye-wrap">
                        <input type="password" id="groq-key" class="form-control" value="${config.apiKey || ''}" placeholder="gsk_..." autocomplete="off">
                        <button type="button" id="toggle-groq-key" class="eye-btn" aria-label="Show/Hide API Key" tabindex="0">👁️</button>
                    </div>
                </div>
                <div class="card">
                    <label for="groq-model">Model</label>
                    <select id="groq-model" class="form-control">
                        ${GROQ_MODELS.map(m => `<option value="${m.id}" ${config.groqModel === m.id ? 'selected' : ''}>${m.label}</option>`).join('')}
                    </select>
                </div>
            `;
        } else if (provider === 'gemini') {
            return `
                <div class="card">
                    <label for="gemini-key">Gemini API Key</label>
                    <input type="password" id="gemini-key" class="form-control" value="${config.geminiKey || ''}" placeholder="AIza...">
                </div>
                <div class="card">
                    <label for="gemini-model">Model</label>
                    <select id="gemini-model" class="form-control">
                        ${GEMINI_MODELS.map(m => `<option value="${m.id}" ${config.geminiModel === m.id ? 'selected' : ''}>${m.label}</option>`).join('')}
                    </select>
                </div>
            `;
        } else if (provider === 'openai') {
            return `
                <div class="card">
                    <label for="openai-key">OpenAI API Key</label>
                    <input type="password" id="openai-key" class="form-control" value="${config.openaiKey || ''}" placeholder="sk-...">
                </div>
                <div class="card">
                    <label for="openai-model">Model</label>
                    <select id="openai-model" class="form-control">
                        <option value="gpt-4o" ${config.openaiModel === 'gpt-4o' ? 'selected' : ''}>GPT-4o (Smartest)</option>
                        <option value="gpt-4o-mini" ${config.openaiModel === 'gpt-4o-mini' ? 'selected' : ''}>GPT-4o-mini (Fast)</option>
                    </select>
                </div>
            `;
        } else if (provider === 'local') {
            // Show all downloaded Ollama models
            let modelsHtml = '<option value="">Loading...</option>';
            if (window.__OLLAMA_MODELS__) {
                modelsHtml = window.__OLLAMA_MODELS__.map((m: any) => `<option value="${m.name}" ${config.localModel === m.name ? 'selected' : ''}>${m.name}</option>`).join('');
            }
            return `
                <div class="card">
                    <label for="local-baseurl">Local LLM Base URL</label>
                    <input type="text" id="local-baseurl" class="form-control" value="${config.baseUrl || ''}" placeholder="http://localhost:11434">
                </div>
                <div class="card">
                    <label for="local-model">Local Model</label>
                    <div class="input-group">
                        <select id="local-model" class="form-control">${modelsHtml}</select>
                        <button id="refresh-ollama" class="icon-btn" title="Refresh Models">↻</button>
                    </div>
                </div>
            `;
        }

        return `<div class="card"><p>Provider configuration coming soon.</p></div>`;
    }
}