
import { DryRunResult } from "../../core/types/sheetos";

export class PreviewPanel {
    render(dryRun?: DryRunResult): string {
        if (!dryRun) return `<div class="panel-loading">Generating structural diff...</div>`;

        return `
            <div class="panel-content">
                <div class="panel-header">
                    <h2>Pre-Execution Guard</h2>
                    <span class="badge ${dryRun.isSafe ? 'badge-green' : 'badge-orange'}">
                        ${dryRun.isSafe ? 'Validated' : 'Requires Review'}
                    </span>
                </div>

                <div class="card diff-summary">
                    <div class="summary-item">
                        <span class="count">${dryRun.changes.length}</span>
                        <label>Cell Changes</label>
                    </div>
                    <div class="summary-item">
                        <span class="count">${dryRun.changes.filter(c => c.type === 'FORMAT').length}</span>
                        <label>Formatting</label>
                    </div>
                </div>

                <div class="diff-viewer">
                    <div class="diff-header">
                        <span>Structural Changes</span>
                    </div>
                    ${dryRun.changes.map(change => `
                        <div class="diff-row">
                            <span class="diff-range">${change.range}</span>
                            <span class="diff-action ${change.type.toLowerCase()}">${change.type}</span>
                            <span class="diff-reason">${change.reason}</span>
                        </div>
                    `).join('')}
                    ${dryRun.changes.length === 0 ? '<div class="empty-state">No structural changes detected.</div>' : ''}
                </div>

                ${dryRun.warnings.length > 0 ? `
                    <div class="warning-box">
                        <i class="icon">⚠️</i>
                        <div class="warnings">
                            ${dryRun.warnings.map(w => `<p>${w}</p>`).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="action-footer">
                    <button id="cancel-action" class="btn btn-ghost">Cancel</button>
                    <button id="confirm-action" class="btn btn-primary">Execute Automation</button>
                </div>
            </div>
        `;
    }
}
