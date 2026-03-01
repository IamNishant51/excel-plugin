import { EngineState } from "../types/ui-types";

export class EngineStatusCard {
  render(state: EngineState): string {
    return `
      <div class="engine-status-card">
        <div class="row"><strong>Sheet</strong><span>${state.sheetName || '—'}</span></div>
        <div class="row"><strong>Stage</strong><span>${state.stage}</span></div>
        <div class="row"><strong>Status</strong><span class="badge ${state.status.toLowerCase()}">${state.status}</span></div>
      </div>
    `;
  }
}
