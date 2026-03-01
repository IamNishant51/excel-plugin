
import { UserIntent } from "../../core/types/sheetos";

export class PlanPanel {
    render(intent?: UserIntent): string {
        if (!intent) return `<div class="panel-loading">Generating execution graph...</div>`;

        const badgeClass = this.getIntentBadge(intent.type);

        return `
            <div class="panel-content">
                <div class="panel-header">
                    <h2>Automation Strategy</h2>
                    <span class="badge ${badgeClass}">${intent.type}</span>
                </div>

                <div class="card intent-card">
                    <div class="intent-desc">"${intent.description}"</div>
                </div>

                <div class="action-graph-container">
                    <label>Action Dependencies</label>
                    <div class="graph-placeholder" id="action-graph">
                        <!-- Logic for dynamic Action Graph nodes -->
                        <div class="graph-node">
                            <i class="node-icon">🔍</i>
                            <span>Read Values</span>
                        </div>
                        <div class="graph-arrow">↓</div>
                        <div class="graph-node">
                            <i class="node-icon">⚙</i>
                            <span>Processing Logic</span>
                        </div>
                        <div class="graph-arrow">↓</div>
                        <div class="graph-node active">
                            <i class="node-icon">✍</i>
                            <span>Atomic Write</span>
                        </div>
                    </div>
                </div>

                <div class="card impact-card">
                    <div class="impact-header">
                        <label>Impact Probability</label>
                        <span class="impact-score">Score: 42</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 42%; background: var(--status-warning);"></div>
                    </div>
                </div>
            </div>
        `;
    }

    private getIntentBadge(type: string): string {
        switch (type) {
            case "READ_ONLY": return "badge-green";
            case "DATA_TRANSFORM": return "badge-blue";
            case "STRUCTURAL_CHANGE": return "badge-orange";
            case "DESTRUCTIVE_ACTION": return "badge-red";
            default: return "badge-blue";
        }
    }
}
