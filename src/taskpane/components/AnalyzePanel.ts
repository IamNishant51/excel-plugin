
import { SheetSchema } from "../../core/types/sheetos";

export class AnalyzePanel {
    render(schema?: SheetSchema): string {
        if (!schema) return `<div class="panel-loading">Analyzing sheet environment...</div>`;

        return `
            <div class="panel-content">
                <div class="panel-header">
                    <h2>Sheet Ecosystem Analysis</h2>
                    <span class="badge badge-blue">Deterministic Extraction</span>
                </div>

                <div class="info-grid">
                    <div class="card">
                        <label>Active Range</label>
                        <div class="value">${schema.usedRange}</div>
                    </div>
                    <div class="card">
                        <label>Payload Size</label>
                        <div class="value">${schema.rowCount} rows × ${schema.columnCount} columns</div>
                    </div>
                </div>

                <div class="card">
                    <label>Detected Headers</label>
                    <div class="chip-group">
                        ${schema.headers.map(h => `<span class="chip">${h}</span>`).join('')}
                    </div>
                </div>

                <div class="card">
                    <label>Integrity Report</label>
                    <ul class="analysis-list">
                        <li class="${schema.mergedCells.length > 0 ? 'warn' : 'check'}">
                            ${schema.mergedCells.length > 0 ? 'Merged cells detected' : 'No merged cells (Ideal)'}
                        </li>
                        <li class="${schema.frozenRows > 0 ? 'info' : 'check'}">
                            ${schema.frozenRows > 0 ? `Frozen Rows: ${schema.frozenRows}` : 'Standard row layout'}
                        </li>
                        <li class="${schema.tables.length > 0 ? 'check' : 'info'}">
                            ${schema.tables.length > 0 ? `${schema.tables.length} Tables found` : 'Flat data structure'}
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }
}
