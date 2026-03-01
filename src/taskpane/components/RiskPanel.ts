import { RiskReport } from "../types/ui-types";

export class RiskPanel {
  render(risk?: RiskReport): string {
    if (!risk) return `<section class="card risk-panel"><h3>Risk</h3><p>No issues detected.</p></section>`;
    return `
      <section class="card risk-panel">
        <h3>Risk</h3>
        <div class="kv"><strong>Level</strong><span class="badge ${risk.level.toLowerCase()}">${risk.level}</span></div>
        <div class="kv"><strong>Score</strong><span>${risk.score}</span></div>
        <ul class="findings">
          ${risk.findings.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </section>
    `;
  }
}
