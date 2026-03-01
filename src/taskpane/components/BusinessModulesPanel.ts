export class BusinessModulesPanel {
    render(): string {
        return `
            <div class="panel-content modules-panel">
                <div class="panel-header">
                    <h2>Business Automation</h2>
                    <span class="badge badge-gold">Enterprise Modules</span>
                </div>

                <div class="modules-grid">
                    <div class="module-card" id="mod-reconcile">
                        <div class="module-icon">💰</div>
                        <div class="module-info">
                            <h3>Reconcile Invoices</h3>
                            <p>Match invoice sheet with bank statements using deterministic rules.</p>
                        </div>
                        <button class="btn btn-primary sm">Run</button>
                    </div>

                    <div class="module-card" id="mod-resumes">
                        <div class="module-icon">📄</div>
                        <div class="module-info">
                            <h3>Parse Resumes</h3>
                            <p>Extract candidates and score against JD using keyword mapping.</p>
                        </div>
                        <button class="btn btn-primary sm">Run</button>
                    </div>

                    <div class="module-card" id="mod-audit">
                        <div class="module-icon">🛡️</div>
                        <div class="module-info">
                            <h3>Risk Health Audit</h3>
                            <p>Scan for formula inconsistencies, merge debt, and hidden risks.</p>
                        </div>
                        <button class="btn btn-primary sm">Analyze</button>
                    </div>

                    <div class="module-card" id="mod-clean">
                        <div class="module-icon">🧹</div>
                        <div class="module-info">
                            <h3>Smart Clean</h3>
                            <p>Normalize phone numbers, trim spaces, and fix date formats.</p>
                        </div>
                        <button class="btn btn-primary sm">Execute</button>
                    </div>
                </div>

                <div class="module-preview-area" id="module-preview" style="display:none;">
                    <h4>Pre-Execution Preview</h4>
                    <div id="preview-content"></div>
                    <div class="action-footer">
                        <button id="cancel-module" class="btn btn-ghost">Cancel</button>
                        <button id="confirm-module" class="btn btn-primary">Confirm & Write</button>
                    </div>
                </div>
            </div>
        `;
    }
}
