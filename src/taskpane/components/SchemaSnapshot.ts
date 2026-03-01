import { EngineState } from "../types/ui-types";

export class SchemaSnapshot {
  render(state: EngineState): string {
    const s = state.schemaSnapshot || {};
    return `
      <section class="card schema-snapshot">
        <h3>Schema Snapshot</h3>
        <div class="meta-row"><span>Used Range:</span><span>${s.usedRange || '-'}</span></div>
        <div class="meta-row"><span>Headers:</span><span>${(s.headers || []).slice(0,6).join(', ')}</span></div>
        <div class="meta-row monospace small">${JSON.stringify(s.columnTypes || {}, null, 2)}</div>
      </section>
    `;
  }
}
