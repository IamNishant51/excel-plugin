import { ExecutionSummary } from "../types/ui-types";

export class ImpactMeter {
  render(execution?: ExecutionSummary): string {
    const cells = execution ? execution.cellsAffected : 0;
    const pct = execution ? execution.percentAffected : 0;
    return `
      <section class="card impact-meter">
        <h3>Impact</h3>
        <div class="impact-row"><span class="big">${cells}</span><span>cells</span></div>
        <div class="impact-row"><span class="big">${pct}%</span><span>of sheet</span></div>
      </section>
    `;
  }
}
