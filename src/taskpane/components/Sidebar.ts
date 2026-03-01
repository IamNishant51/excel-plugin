import { EngineState } from "../types/ui-types";

export class Sidebar {
  render(state: EngineState): string {
    const sheet = state.sheetName || 'Unknown';
    return `
      <aside class="sidebar">
        <div class="engine-card">
          <h4>Engine State</h4>
          <div class="kv"><span class="k">Sheet</span><span class="v">${sheet}</span></div>
          <div class="kv"><span class="k">Rows</span><span class="v">${state.rowCount ?? '-'}</span></div>
          <div class="kv"><span class="k">Cols</span><span class="v">${state.columnCount ?? '-'}</span></div>
          <div class="kv"><span class="k">Tables</span><span class="v">${(state.tables || []).length}</span></div>
          <div class="kv"><span class="k">Hidden Rows</span><span class="v">${state.hiddenRows ?? 0}</span></div>
          <div class="kv"><span class="k">Filters</span><span class="v">${state.filtersDetected ? 'Yes' : 'No'}</span></div>
          <div class="kv"><span class="k">Risk</span><span class="v risk">${state.risk?.level ?? 'LOW'}</span></div>
        </div>

        <nav class="pipeline-nav">
          <ul>
            <li class="stage ${state.stage === 'ANALYZE' ? 'active' : ''}">Analyze</li>
            <li class="stage ${state.stage === 'PLAN' ? 'active' : ''}">Plan</li>
            <li class="stage ${state.stage === 'PREVIEW' ? 'active' : ''}">Preview</li>
            <li class="stage ${state.stage === 'EXECUTE' ? 'active' : ''}">Execute</li>
            <li class="stage ${state.stage === 'HISTORY' ? 'active' : ''}">History</li>
          </ul>
        </nav>
      </aside>
    `;
  }
}
