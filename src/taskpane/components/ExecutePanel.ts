
import { ExecutionMetrics } from "../state/types";

export class ExecutePanel {
    render(metrics?: ExecutionMetrics, status: "RUNNING" | "SUCCESS" | "FAILED" = "RUNNING"): string {
        return `
            <div class="panel-content flex-center">
                <div class="execution-state ${status.toLowerCase()}">
                    ${status === 'RUNNING' ? `
                        <div class="spinner-large"></div>
                        <h3>Engine Executing...</h3>
                        <p>Performing atomic operations on worksheet</p>
                    ` : status === 'SUCCESS' ? `
                        <div class="success-icon">✓</div>
                        <h3>Automation Complete</h3>
                        <p>Integrity check passed.</p>
                    ` : `
                        <div class="error-icon">✕</div>
                        <h3>Execution Failed</h3>
                        <p>Automatic rollback initiated.</p>
                    `}
                </div>

                <div class="card metrics-card">
                    <div class="metric-row">
                        <label>Sync Calls</label>
                        <span>${metrics?.syncCount || 0}</span>
                    </div>
                    <div class="metric-row">
                        <label>Execution Time</label>
                        <span>${metrics?.durationMs ? (metrics.durationMs / 1000).toFixed(2) + 's' : '0.00s'}</span>
                    </div>
                </div>

                ${status === 'SUCCESS' ? `
                    <div class="action-footer">
                        <button id="rollback-manual" class="btn btn-danger-ghost">Undo (Rollback)</button>
                        <button id="finish-action" class="btn btn-primary">Done</button>
                    </div>
                ` : ''}
            </div>
        `;
    }
}
