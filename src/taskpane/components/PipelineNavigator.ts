
import { UIPhase } from "../state/types";

export class PipelineNavigator {
    private phases: UIPhase[] = ["ANALYZE", "PLAN", "PREVIEW", "EXECUTE", "HISTORY"];

    render(currentPhase: UIPhase): string {
        return `
            <nav class="pipeline-nav">
                <div class="pipeline-track"></div>
                ${this.phases.map((phase, index) => `
                    <div class="phase-step ${this.getPhaseClass(phase, currentPhase)}" data-phase="${phase}">
                        <div class="step-circle">${index + 1}</div>
                        <span class="step-label">${phase.charAt(0) + phase.slice(1).toLowerCase()}</span>
                    </div>
                `).join('')}
            </nav>
        `;
    }

    private getPhaseClass(phase: UIPhase, current: UIPhase): string {
        const index = this.phases.indexOf(phase);
        const currentIndex = this.phases.indexOf(current);
        if (phase === current) return "active";
        if (index < currentIndex) return "completed";
        return "pending";
    }
}
